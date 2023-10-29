/**
 * Classe para realizar classificação de texto usando Regressão Logística com regularização.
 * @author Adriel, Kauana, Vinicius, Leandro, Danilo - BSI2 - FORTEC - 2023
 * Assume-se que existe um modelo salvo para detecção de conteúdo tóxico treinado em PHP.
 */
class TextLogisticRegression {
    /**
     * Construtor para a classe TextLogisticRegression.
     * @param {number} alpha - Taxa de aprendizado para o gradiente descendente.
     * @param {number} maxIterations - Número máximo de iterações para o gradiente descendente.
     * @param {number} lambda - Parâmetro de regularização para evitar overfitting.
     */
    constructor(alpha = 0.01, maxIterations = 1000, lambda = 0.1) {
        this.alpha = alpha;
        this.maxIterations = maxIterations;
        this.lambda = lambda;
    }

    /**
     * Calcula o valor da função sigmoid para a entrada fornecida.
     * @param {number} z - Valor de entrada.
     * @returns {number} - Valor sigmoid calculado.
     */
    sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }

    /**
     * Aplica a transformação de texto para vetor de características usando Bag-of-Words.
     * @param {string} text - Texto de entrada.
     * @returns {Array} - Vetor de características numéricas.
     */
    textToFeatureVector(text) {
        text = text.toLowerCase();
        const words = text.match(/\b\w+\b/g);

        const vector = Array.from({ length: Object.keys(this.vocabulary).length }, () => 0);

        if (words) {
            words.forEach((word) => {
                if (this.vocabulary.hasOwnProperty(word)) {
                    vector[this.vocabulary[word]]++;
                }
            });
        }

        return vector;
    }

    /**
     * Prevê a probabilidade da classe positiva para um único texto.
     * @param {string} text - Texto de entrada.
     * @returns {number} - Probabilidade prevista.
     */
    predictText(text) {
        const vector = this.textToFeatureVector(text, this.vocabulary);
        let z = 0;

        for (let j = 0; j < vector.length; j++) {
            z += this.theta[j] * vector[j];
        }

        const h = this.sigmoid(z);
        return h;
    }

    async loadModel(filename) {
        const modelData = await fetch(filename + '.json').then(response => response.json());

        this.theta = modelData.theta;
        this.alpha = modelData.alpha;
        this.maxIterations = modelData.maxIterations;
        this.lambda = modelData.lambda;
        this.vocabulary = modelData.vocabulary;
    }
}
