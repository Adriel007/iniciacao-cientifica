<?php
namespace StringTools;

trait StringTools
{
    public function removeStopWords(string $str): string
    {
        $str = ' ' . $str . ' ';
        $stopWords = json_decode(file_get_contents("./dataset/stopWords.json"), true);
        $words = explode(' ', $str);

        for ($c = 0; $c < count($words); $c++) {
            for ($i = 0; $i < count($stopWords); $i++) {
                if (strtolower($words[$c]) === $stopWords[$i]) {
                    $str = str_replace(' ' . $words[$c] . ' ', ' ', $str);
                    break;
                }
            }
        }

        return trim($str);
    }

    private function clean(string $str): string
    {
        $str = strtolower($str);

        // Remover acentos
        $str = $this->removeAcentos($str);

        // Remover emojis
        $str = preg_replace('/[\x{1F600}-\x{1F64F}]/u', '', $str);

        // Remover links
        $str = preg_replace('/https?:\/\/\S+/', '', $str);

        // Remover menções com "#" ou "@"
        $str = preg_replace('/[#@]\S+/', '', $str);

        // Remover pontuações
        $str = preg_replace('/[^\w\s]/u', '', $str);

        return $str;
    }

    private function removeAcentos(string $str): string
    {
        $acentos = [
            'á' => 'a',
            'à' => 'a',
            'ã' => 'a',
            'â' => 'a',
            'é' => 'e',
            'è' => 'e',
            'ê' => 'e',
            'í' => 'i',
            'ì' => 'i',
            'î' => 'i',
            'ó' => 'o',
            'ò' => 'o',
            'õ' => 'o',
            'ô' => 'o',
            'ú' => 'u',
            'ù' => 'u',
            'û' => 'u',
            'ç' => 'c'
        ];

        return strtr($str, $acentos);
    }
}

?>