<?php
require_once "./StringTools.php";
class Naive_Bayes
{
    use StringTools\StringTools;
    private $total_samples = 0;
    private $total_tokens = 0;
    private $subjects = [];
    private $tokens = [];
    public function classify($str)
    {

        if ($this->total_samples === 0)
            return [];

        $tokens = $this->tokenize($str);
        $total_score = 0;
        $scores = [];

        foreach ($this->subjects as $subject => $subject_data) {

            $subject_data['prior_value'] = log($subject_data['count_samples'] / $this->total_samples);
            $this->subjects[$subject] = $subject_data;
            $scores[$subject] = 0;

            foreach ($tokens as $token) {
                $count = isset($this->tokens[$token][$subject]) ? $this->tokens[$token][$subject] : 0;
                $scores[$subject] += log(($count + 1) / ($subject_data['count_tokens'] + $this->total_tokens));
            }

            $scores[$subject] = $subject_data['prior_value'] + $scores[$subject];
            $total_score += $scores[$subject];

        }

        $min = min($scores);
        $sum = 0;
        foreach ($scores as $subject => $score) {
            $scores[$subject] = exp($score - $min);
            $sum += $scores[$subject];
        }

        if ($sum > 0) {
            foreach ($scores as $subject => $score) {
                $scores[$subject] = $score / $sum;
            }
        } else {
            // Tratar caso especial quando a soma das pontuações é 0
            $numCategories = count($scores);
            $defaultProbability = 1 / $numCategories;
            $totalDefaultProbability = $defaultProbability * $numCategories;

            foreach ($scores as $subject => $score) {
                $scores[$subject] = $defaultProbability;
            }

            // Distribuir a probabilidade restante uniformemente entre as categorias
            $remainingProbability = 1 - $totalDefaultProbability;
            $additionalProbability = $remainingProbability / $numCategories;

            foreach ($scores as $subject => $score) {
                $scores[$subject] += $additionalProbability;
            }
        }

        arsort($scores);
        return $scores;

    }
    public function tokenize($str)
    {
        $str = $this->removeStopWords($str);
        $str = $this->clean($str);

        $count = preg_match_all('/\w+/', $str, $matches);

        return $count ? $matches[0] : [];

    }

    public function train($subject, $rows)
    {

        if (!isset($this->subjects[$subject])) {
            $this->subjects[$subject] = array(
                'count_samples' => 0,
                'count_tokens' => 0,
                'prior_value' => null,
            );
        }

        if (empty($rows))
            return $this;
        if (!is_array($rows))
            $rows = array($rows);

        foreach ($rows as $row) {

            $this->total_samples++;
            $this->subjects[$subject]['count_samples']++;

            $tokens = $this->tokenize($row);

            foreach ($tokens as $token) {

                if (!isset($this->tokens[$token][$subject]))
                    $this->tokens[$token][$subject] = 0;

                $this->tokens[$token][$subject]++;
                $this->subjects[$subject]['count_tokens']++;
                $this->total_tokens++;

            }

        }

    }

    public function saveModel($filename)
    {
        $model = [
            'total_samples' => $this->total_samples,
            'total_tokens' => $this->total_tokens,
            'subjects' => $this->subjects,
            'tokens' => $this->tokens,
        ];

        $jsonModel = json_encode($model);
        file_put_contents($filename, $jsonModel);
    }

    public static function loadModel($filename)
    {
        $jsonModel = file_get_contents($filename);
        $model = json_decode($jsonModel, true);

        if ($model) {
            $naiveBayes = new self();
            $naiveBayes->total_samples = $model['total_samples'];
            $naiveBayes->total_tokens = $model['total_tokens'];
            $naiveBayes->subjects = $model['subjects'];
            $naiveBayes->tokens = $model['tokens'];

            return $naiveBayes;
        } else {
            throw new Exception("Failed to load the model from JSON.");
        }
    }

}