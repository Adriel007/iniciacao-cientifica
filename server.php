<?php
ini_set('memory_limit', '-1');
set_time_limit(0);
//error_reporting(0);

include("./SearchLogic.php");

$text = 'A importancia de termos a ciência ao nosso lado a fim de evitar desvios socioculturais é de grande importancia';

$searchLogic = new SearchLogic('./dataset/normal', './dataset/toxic');
$probability = $searchLogic->classify($text);

//echo "\033[2J\033[H";
echo "Text: $text\n-------------------------------------\n";
echo "Probability: (Tóxico: " . $probability['toxic'] * 100 . "%) (Normal: " . $probability['normal'] * 100 . "%)\n";
//echo "Result: " . ($probability > 65 ? "Toxic" : "Normal") . "\n";