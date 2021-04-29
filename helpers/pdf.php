<?php

use Mpdf\Mpdf;
use Mpdf\MpdfException;

/**
 * Create PDF object
 *
 * @param string $view Blade template
 * @param array $data Blade data
 * @return Mpdf
 * @throws MpdfException
 */
function make_pdf(string $view, array $data)
{
    // $font_dirs = (new Mpdf\Config\ConfigVariables())->getDefaults()['fontDir'];
    // $font_data = (new Mpdf\Config\FontVariables())->getDefaults()['fontdata'];

    // $mdpf_options = [
    // 	'fontDir' => array_merge($font_dirs, [
    // 		base_path('fonts/poppins'),
    // 	]),
    // 	'fontdata' => array_merge($font_data, [
    // 		'poppins' => [
    // 			'R' => 'Poppins-Regular.ttf',
    // 		],
    // 	]),
    // 	'default_font' => 'poppins',
    // ];

    $mpdf = new Mpdf();

    $mpdf->simpleTables = true;
    $mpdf->packTableData = true;
    $mpdf->CSSselectMedia = 'screen';
    $mpdf->ignore_invalid_utf8 = true;

    $mpdf->setFooter('{PAGENO} / {nb}');
    $mpdf->WriteHTML(get_view($view, $data));

    return $mpdf;
}

/**
 * Save PDF
 *
 * @param string $view Blade template
 * @param array $data Blade data
 * @param string $output Output path
 * @return void
 * @throws MpdfException
 */
function save_pdf(string $view, array $data, string $output)
{
    $mpdf = make_pdf($view, $data);
    $mpdf->Output($output, 'F');
}

/**
 * Download PDF in page
 *
 * @param string $view Blade template
 * @param array $data Blade data
 * @param string $output Output name
 * @return void
 * @throws MpdfException
 */
function download_pdf(string $view, array $data, string $output)
{
    $mpdf = make_pdf($view, $data);
    $mpdf->Output($output, 'D');
}

/**
 * Print PDF in page
 *
 * @param string $view Blade template
 * @param array $data Blade data
 * @return void
 * @throws MpdfException
 */
function print_pdf(string $view, array $data)
{
    $mpdf = make_pdf($view, $data);
    $mpdf->Output();
}
