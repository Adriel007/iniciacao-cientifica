<?php
require_once "./NaiveBayes.php";

class SearchLogic
{
    use StringTools\StringTools;
    private array $normal = [];
    private array $toxic = [];

    public function __construct(string $pathNormal, string $pathToxic)
    {
        $this->normal = $this->getAllFilesContents($pathNormal);
        $this->toxic = $this->getAllFilesContents($pathToxic);
    }

    public function classify(string $text): array
    {
        $naiveBayes = null;

        if (file_exists("./model.json")) {
            $naiveBayes = Naive_Bayes::loadModel("./model.json");
        } else {
            $naiveBayes = new Naive_Bayes();

            foreach ($this->normal as $normal) {
                $naiveBayes->train("normal", $normal);
            }
            foreach ($this->toxic as $toxic) {
                $naiveBayes->train("toxic", $toxic);
            }

            $naiveBayes->saveModel("./model.json");
        }

        return $naiveBayes->classify($text);
    }

    private function getAllFilesContents(string $directoryPath): array
    {
        $fileContents = [];

        // Check if the given path is a directory
        if (is_dir($directoryPath)) {
            $files = scandir($directoryPath);

            foreach ($files as $file) {
                // Exclude "." and ".." entries
                if ($file !== "." && $file !== "..") {
                    $filePath = $directoryPath . DIRECTORY_SEPARATOR . $file;

                    // Check if it's a file
                    if (is_file($filePath)) {
                        $fileContents[$file] = $this->removeStopWords($this->clean(file_get_contents($filePath)));
                    }
                }
            }
        }

        return $fileContents;
    }
}
?>