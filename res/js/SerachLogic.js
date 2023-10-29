/**
 * Classe SearchLogic para realizar pesquisas de texto com detecção de conteúdo tóxico.
 * @author Adriel, Kauana, Vinicius, Leandro, Danilo - BSI2 - FORTEC - 2023 
 */
class SearchLogic {
    /**
     * Construtor da classe SearchLogic.
     * @param {Array} swearword - Um array de palavras consideradas palavrões ou ofensivas.
     * @param {string} savedModel - O caminho para o modelo salvo para detecção de conteúdo tóxico.
     */
    constructor(swearword, savedModel) {
        this.swearword = swearword;
        this.savedModel = savedModel;
    }

    /**
     * Realiza uma pesquisa por keywords em um texto para detectar conteúdo tóxico.
     * @param {string} text - O texto a ser verificado.
     * @returns {string} - Retorna '100%' se palavras ofensivas forem encontradas, caso contrário, executa uma busca "hard".
     */
    async softSearch(text) {
        for (const word of this.swearword) {
            if (text.includes(" " + word)) {
                return '100%';
            }
        }
        return this.hardSearch(text);
    }

    /**
     * Realiza uma pesquisa por intenção em um texto para detectar conteúdo tóxico.
     * @param {string} text - O texto a ser verificado.
     * @returns {string} - Retorna a probabilidade de conteúdo tóxico no texto em formato de porcentagem.
     */
    async hardSearch(text) {
        const lr = new TextLogisticRegression();
        await lr.loadModel(this.savedModel);

        return (lr.predictText(text) * 100).toFixed(2) + "%";
    }
}