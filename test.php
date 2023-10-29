<?php
include("./SearchLogic.php");
//error_reporting(0);

$normal_path = "./dataset/test/normal.txt";
$toxic_path = "./dataset/test/toxic.txt";

$normal = explode("<@@@>", file_get_contents($normal_path));
$toxic = explode("<@@@>", file_get_contents($toxic_path));

$normal_sum = [];
$toxic_sum = [];

$searchLogic = new SearchLogic('./dataset/normal', './dataset/toxic');

for ($i = 0; $i < count($normal); $i++) {
    $normal_sum[] = $searchLogic->classify($normal[$i])["normal"];
    $toxic_sum[] = $searchLogic->classify($toxic[$i])["toxic"];
}

echo $normal[0] . "\n";
echo "normal: " . $normal_sum[0] . "\n";
echo "toxic: " . $toxic_sum[0] . "\n";

?>