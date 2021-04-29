<?php

namespace Tbnt\Cms\Utils\Google;

use Exception;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;

class CalendarGoogleUtils
{
    /**
     * Get client
     *
     * @return Google_Client
     */
    private static function getClient()
    {
        return OAuthGoogleUtils::getClientImpersonate(Google_Service_Calendar::CALENDAR);
    }

    /**
     * Get service
     *
     * @return Google_Service_Calendar
     */
    private static function getService()
    {
        return new Google_Service_Calendar(self::getClient());
    }

    /**
     * Get events
     *
     * @param array $options
     * @return array
     */
    public static function getEvents($options = [])
    {
        $options = array_merge(
            [
                'id' => '',
                'start' => '00:00',
                'end' => '23:59',
                'date' => null,
                'days' => 0,
            ],
            $options
        );

        if (is_string($options['start']) === true) {
            $options['start'] = explode(':', $options['start']);
        }
        if (is_string($options['end']) === true) {
            $options['end'] = explode(':', $options['end']);
        }

        $data = [];
        $data['options'] = $options;

        if (trim($options['id']) === '') {
            $data['error'] = 'Google calendar ID undefined.';
        } else {
            $service = self::getService();

            try {
                $data['calendar'] = $service->calendars->get($options['id']);
                $data['events'] = [];

                $date = carbon($options['date'] ?: now());
                $date->timezone = $data['calendar']['timeZone'];
                $date->hour = 0;
                $date->minute = 0;
                $date->second = 0;

                $date_from = clone $date;
                $date_from->hour = $options['start'][0];
                $date_from->minute = $options['start'][1];

                $date_to = (clone $date)->addDays($options['days']);
                $date_to->hour = $options['end'][0];
                $date_to->minute = $options['end'][1];

                $events = $service->events
                    ->listEvents($data['calendar']->id, [
                        'orderBy' => 'startTime',
                        'singleEvents' => true,
                        'timeMin' => $date_from->toRfc3339String(),
                        'timeMax' => $date_to->toRfc3339String(),
                    ])
                    ->getItems();

                $data['events_count'] = count($events);

                for ($i = 0, $c = $options['days'] + 1; $i < $c; $i++) {
                    $data['events'][(clone $date)->addDays($i)->toDateString()] = [];
                }

                foreach ($events as $event) {
                    $event->start = carbon($event->start->dateTime ?? ($event->start->date ?? null));
                    $event->end = carbon($event->end->dateTime ?? ($event->end->date ?? null));

                    if ($event->start->lt($date_from)) {
                        $event->start = $date_from;
                    }
                    if ($event->end->gt($date_to)) {
                        $event->end = $date_to;
                    }

                    if (isset($data['events'][$event->start->toDateString()]) === true) {
                        $data['events'][$event->start->toDateString()][] = $event;
                    }

                    if (
                        $event->start->toDateString() !== $event->end->toDateString() &&
                        isset($data['events'][$event->end->toDateString()]) === true
                    ) {
                        $data['events'][$event->end->toDateString()][] = $event;
                    }
                }
            } catch (Exception $e) {
                $data['error'] = $e->getMessage();
            }
        }

        return $data;
    }

    /**
     * Add event
     *
     * @param array $options
     * @return array
     */
    public static function addEvent($options = [])
    {
        $options = array_merge(
            [
                'id' => '',
                'start' => '',
                'end' => '',
                'summary' => '',
                'description' => '',
            ],
            $options
        );

        $data = [];

        if (trim($options['id']) === '') {
            $data['error'] = 'Google calendar ID undefined.';
        } else {
            $service = self::getService();

            try {
                $data['calendar'] = $service->calendars->get($options['id']);

                $event = $service->events->insert(
                    $data['calendar']->id,
                    new Google_Service_Calendar_Event([
                        'start' => ['dateTime' => $options['start']],
                        'end' => ['dateTime' => $options['end']],
                        'summary' => $options['summary'],
                        'description' => $options['description'],
                    ])
                );

                $data['event'] = [
                    'from' => carbon($event->start->dateTime ?? ($event->start->date ?? null))->toRfc3339String(),
                    'to' => carbon($event->end->dateTime ?? ($event->end->date ?? null))->toRfc3339String(),
                    'summary' => $event->summary,
                    'description' => $event->description,
                    'event' => $event,
                ];
            } catch (Exception $e) {
                $data['error'] = $e->getMessage();
            }
        }

        return $data;
    }

    /**
     * Check if has events
     *
     * @param array $options
     * @return bool
     */
    public static function hasEvents($options = [])
    {
        $events = self::getEvents($options);

        return isset($events['events_count']) === true ? $events['events_count'] !== 0 : null;
    }

    /**
     * Get free slots
     *
     * @param array $options
     * @return array
     */
    public static function getFreeSlots($options = [])
    {
        $data = self::getEvents($options);

        if (isset($data['error']) === true) {
            return [];
        }

        $options = array_merge(['min' => 0], $data['options']);

        if (is_integer($options['min']) === false) {
            $options['min'] = intval($options['min']);
        }

        $data_calendar = $data['calendar'];
        $data_events = $data['events'];

        $now = now();
        $now->timezone = $data_calendar['timeZone'];

        foreach ($data_events as $date_key => &$events) {
            $current = carbon($date_key);
            $current->timezone = $data_calendar['timeZone'];
            $current->hour = 0;
            $current->minute = 0;
            $current->second = 0;

            $current_from = clone $current;
            $current_from->hour = $options['start'][0];
            $current_from->minute = $options['start'][1];

            $current_to = clone $current;
            $current_to->hour = $options['end'][0];
            $current_to->minute = $options['end'][1];

            // Filter/format/chunk dates
            $dates = [$current_from->toRfc3339String()];

            foreach ($events as $event) {
                if ($event->start->gt($current_to) === true || $event->end->lt($current_from) === true) {
                    continue;
                }
                if ($event->start->lt($current_from) === true) {
                    $event->start = $current_from;
                }
                if ($event->end->gt($current_to) === true) {
                    $event->end = $current_to;
                }

                $event->start->minute = floor($event->start->minute / 15) * 15;
                $event->start->second = 0;

                $event->end->minute = ceil($event->end->minute / 15) * 15;
                $event->end->second = 0;

                $dates[] = $event->start->toRfc3339String();
                $dates[] = $event->end->toRfc3339String();
            }

            $dates[] = $current_to->toRfc3339String();

            // Set min date to min now
            $dates = array_map(function ($date) use ($now) {
                $from = carbon($date[0]);
                $to = carbon($date[1]);

                if ($from->lt($now) === true && $to->gt($now) === true) {
                    $from = clone $now;
                    $from->minute = ceil($from->minute / 15) * 15;
                    $from->second = 0;

                    $date[0] = $from->toRfc3339String();
                }

                return $date;
            }, array_chunk($dates, 2));

            // Filter dates less than meeting room min time
            $events = array_values(
                array_filter($dates, function ($date) use ($options, $now) {
                    $from = carbon($date[0]);
                    $to = carbon($date[1]);

                    return $date[0] !== $date[1] && $options['min'] <= $from->diffInMinutes($to) && $now->lte($to);
                })
            );
        }

        return $data_events;
    }
}
