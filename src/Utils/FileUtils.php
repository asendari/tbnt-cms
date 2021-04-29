<?php

namespace Tbnt\Cms\Utils;

use Exception;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image as FacadesImage;
use Tbnt\Cms\Model\File;
use Validator;

class FileUtils
{
    /**
     * Get file max size
     *
     * @return int
     */
    public static function getFileMaxSize()
    {
        return config('cmsfile.max_size');
    }

    /**
     * Get image max size
     *
     * @return int
     */
    public static function getImageMaxSize()
    {
        return config('cmsfile.image_max_size');
    }

    /**
     * Get image max width
     *
     * @return int
     */
    public static function getImageMaxWidth()
    {
        return config('cmsfile.image_max_width');
    }

    /**
     * Get thumb max width
     *
     * @return int
     */
    public static function getThumbMaxWidth()
    {
        return config('cmsfile.thumb_max_width');
    }

    /**
     * Get JPG quality
     *
     * @return int
     */
    public static function getJpgQuality()
    {
        return config('cmsfile.image_quality');
    }

    /**
     * Get storage folder
     *
     * @return string
     */
    public static function getStorageFolder()
    {
        return config('cmsfile.folder');
    }

    /**
     * Get thumb max width
     *
     * @return Filesystem
     */
    public static function getDisk()
    {
        return Storage::disk(self::getStorageFolder());
    }

    /**
     * Format file root path
     * ex: //absolute_path_to_storage_folder/${any}
     * ex: //absolute_path_to_project/storage/app/uploads/users/515/filename.jpg
     *
     * @param string $any Directory
     * @return string
     */
    public static function formatRoot($any = '')
    {
        return dir_separator([
            self::getDisk()
                ->getDriver()
                ->getAdapter()
                ->getPathPrefix(),
            $any,
        ]);
    }

    /**
     * Format file base path
     * ex: storage_path/${any}
     * ex: storage/app/uploads/users/515/filename.jpg
     *
     * @param string $any Filepath
     * @return string
     */
    public static function formatBase(string $any)
    {
        return dir_separator(['storage', str_replace(storage_path(), '', self::formatRoot($any))]);
    }

    /**
     * Format file local path
     * ex: storage_folder/${any}
     * ex: uploads/users/515/filename.jpg
     *
     * @param string $any Filepath
     * @return string
     */
    public static function formatLocal(string $any)
    {
        return ltrim(str_replace(dir_separator([storage_path(), 'cms']), '', self::formatRoot($any)), '/');
    }

    /**
     * Format file url
     * ex: protocole://domain/storage_folder/${any}
     * ex: protocole://domain/uploads/users/515/filename.jpg
     *
     * @param string $any Filepath
     * @return string
     */
    public static function formatUrl(string $any)
    {
        return app_url(self::formatLocal($any));
    }

    /**
     * Add "thumbs" to any path
     * ex: ${any:dir}/thumbs/${any:file}
     * ex: users/515/thumbs/filename.jpg
     *
     * @param string $any Filepath
     * @return string
     */
    public static function formatThumbDir(string $any)
    {
        $any = explode('/', $any);
        $any_last = strpos(last($any), '.') !== false ? array_pop($any) : null;

        return dir_separator([$any, last($any) !== 'thumbs' ? 'thumbs' : null, $any_last]);
    }

    /**
     * Formate file name
     *
     * @param UploadedFile $file File
     * @param string $filename File name
     * @param string $ext File extension
     * @param string|array $append Filename append
     * @return string
     */
    public static function formatName(UploadedFile $file, $filename = '', $ext = '', $append = '')
    {
        return str()->slug(
            implode('-', [
                trim($filename ?: '') ?: rtrim($file->getClientOriginalName(), '.' . $file->getClientOriginalExtension()),
                implode('-', to_array($append)),
            ])
        ) .
            '.' .
            ($ext ?: $file->getClientOriginalExtension());
    }

    /**
     * Check if file is image
     *
     * @param string $filepath Filepath
     * @return bool
     */
    public static function isImage(string $filepath)
    {
        return @is_array(getimagesize($filepath));
    }

    /**
     * Check if file is image
     *
     * @param string $filepath Filepath
     * @return bool
     */
    public static function exists(string $filepath)
    {
        return self::getDisk()->exists($filepath);
    }

    /**
     * Get file resource
     *
     * @param string $filepath Filepath
     * @return string
     * @throws FileNotFoundException
     */
    public static function getFile(string $filepath)
    {
        return self::exists($filepath) === true ? self::getDisk()->get($filepath) : null;
    }

    /**
     * Get filepath parts
     *
     * @param string $filepath Filepath
     * @return array
     */
    private static function getFileParts(string $filepath)
    {
        $file_parts = explode('/', $filepath);

        $basename = array_pop($file_parts);
        $basename_parts = explode('.', $basename);

        $extension = array_pop($basename_parts);
        $filename = implode('.', $basename_parts);
        $dir = implode('/', $file_parts);

        return [
            'dir' => $dir,
            'extension' => $extension,
            'filename' => $filename,
            'basename' => $basename,
        ];
    }

    /**
     * Insert file
     *
     * @param string $filename Filename
     * @return File
     */
    public static function insert(string $filename)
    {
        return File::create(['filename' => $filename]);
    }

    /**
     * Upload file
     *
     * @param File|null $file File to replace
     * @param UploadedFile $new_file File to upload
     * @param array $options Options
     * @return object
     */
    public static function upload(?File $file, UploadedFile $new_file, $options = [])
    {
        // Remove file if exists
        if ($file !== null) {
            self::delete($file->filename);
        }

        // Upload file
        $name = self::save($new_file, $options);

        // Update database
        if ($file === null) {
            $file = self::insert($name);
        } else {
            $file->updateName($name);
        }

        return $file;
    }

    /**
     * Save file
     *
     * @param UploadedFile $file File
     * @param array $options Options
     * @return string
     */
    public static function save(UploadedFile $file, $options = [])
    {
        $options = array_merge(
            [
                'name' => '',
                'path' => '',
                'timestamp' => false,
                'encode' => true,
                'uuid' => config('cmsfile.uuid'),
            ],
            $options
        );

        if (self::validateMedia($file) === false) {
            return false;
        }

        $parts = self::getFileParts(self::formatName($file, $options['name']));

        $original_ext = $parts['extension'];

        if (in_array($original_ext, ['jpeg', 'jpe'])) {
            $original_ext = 'jpg';
        }

        // Init directories
        $dir_path = slash_end($options['path']);

        // Format file name and path
        $filename =
            $options['uuid'] === true
                ? str()
                    ->orderedUuid()
                    ->toString()
                : $parts['filename'];
        $basename = self::formatName($file, $filename, $original_ext);

        if (self::exists($dir_path . $basename) === true || $options['timestamp'] === true) {
            $basename = self::formatName($file, $filename, $original_ext, microtime(true));
        }

        // Move file
        $root_path = self::formatRoot(self::getDisk()->putFileAs($dir_path, $file, $basename));

        // Format file
        if (in_array($original_ext, ['jpg', 'png']) === true) {
            try {
                $jpg_quality = intval($options['quality'] ?? self::getJpgQuality());
                $thumb_max_width = intval($options['thumb'] ?? self::getThumbMaxWidth());

                // Process image
                $file = FacadesImage::make($root_path);
                $file->orientate();

                if ($options['encode'] === true) {
                    $file->encode($original_ext, 75);
                }

                $file->save($root_path, $jpg_quality);

                // Create thumb
                if (config('cmsfile.thumbs') && $file->width() > $thumb_max_width) {
                    init_dir(self::formatThumbDir(self::formatRoot($dir_path)));

                    $file->widen($thumb_max_width);
                    $file->save(self::formatThumbDir($root_path), $jpg_quality);
                }
            } catch (Exception $e) {
                report($e);
            }
        }

        return $dir_path . $basename;
    }

    /**
     * Delete file
     *
     * @param string $filepath Filepath
     * @return void
     */
    public static function delete(string $filepath)
    {
        self::getDisk()->delete([$filepath, self::formatThumbDir($filepath)]);
    }

    /****************************************************************
     * Validations
     ***************************************************************/

    /**
     * Validate uploads
     *
     * @param UploadedFile $file File to validate
     * @return bool
     */
    public static function validateFile(UploadedFile $file)
    {
        return $file->isValid() === true && Validator::make(['file' => $file], ['file' => 'file_valid|file_size'])->passes();
    }

    /**
     * Validate uploads
     *
     * @param UploadedFile $image Image to validate
     * @return bool
     */
    public static function validateImage(UploadedFile $image)
    {
        return $image->isValid() === true &&
            Validator::make(['image' => $image], ['image' => 'file_valid|image_size|image_dimensions'])->passes();
    }

    /**
     * Validate uploads
     *
     * @param UploadedFile $file File to validate
     * @return bool
     */
    public static function validateMedia(UploadedFile $file)
    {
        return self::isImage($file) === true ? self::validateImage($file) : self::validateFile($file);
    }
}
