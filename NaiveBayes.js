class NaiveBayes {
    constructor() {
        this.total_samples = 0;
        this.total_tokens = 0;
        this.subjects = {};
        this.tokens = {};
        this.stopWords = null;

        this.loading(true);
        if (!localStorage.getItem('model')) {
            fetch('./dataset/stopWords.json')
                .then(res => res.json())
                .then(data => {
                    this.stopWords = data;
                    this.cache();
                    this.loading(false);
                });
        } else {
            this.loading(false);
        }

    }

    loading(show) {
        const loadingElement = document.getElementById('loading');
        if (show) {
            loadingElement.classList.remove('d-none');
            loadingElement.classList.add('d-flex');
        } else {
            loadingElement.classList.remove('d-flex');
            loadingElement.classList.add('d-none');
        }
    }

    cache() {
        const json = {
            total_samples: this.total_samples,
            total_tokens: this.total_tokens,
            subjects: this.subjects,
            tokens: this.tokens,
            stopWords: this.stopWords
        };
        localStorage.setItem('model', JSON.stringify(json));
    }

    classify(str) {
        if (this.total_samples === 0) {
            return {};
        }

        const tokens = this.tokenize(str);
        const scores = {};
        let total_score = 0;

        for (const subject in this.subjects) {
            const subject_data = this.subjects[subject];
            subject_data.prior_value = Math.log(subject_data.count_samples / this.total_samples);
            this.subjects[subject] = subject_data;
            scores[subject] = 0;

            for (const token of tokens) {
                const count = this.tokens[token]?.[subject] || 0;
                scores[subject] += Math.log((count + 1) / (subject_data.count_tokens + this.total_tokens));
            }

            scores[subject] = subject_data.prior_value + scores[subject];
            total_score += scores[subject];
        }

        const min = Math.min(...Object.values(scores));
        let sum = 0;

        for (const subject in scores) {
            scores[subject] = Math.exp(scores[subject] - min);
            sum += scores[subject];
        }

        if (sum > 0) {
            for (const subject in scores) {
                scores[subject] = scores[subject] / sum;
            }
        } else {
            const numCategories = Object.keys(scores).length;
            const defaultProbability = 1 / numCategories;
            const totalDefaultProbability = defaultProbability * numCategories;

            for (const subject in scores) {
                scores[subject] = defaultProbability;
            }

            const remainingProbability = 1 - totalDefaultProbability;
            const additionalProbability = remainingProbability / numCategories;

            for (const subject in scores) {
                scores[subject] += additionalProbability;
            }
        }

        // Sort scores in descending order
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const result = {};
        for (const [subject, score] of sortedScores) {
            result[subject] = score;
        }

        return result;
    }

    tokenize(str) {
        str = this.removeStopWords(str);

        str = this.clean(str);

        const matches = str.match(/\w+/g);
        return matches ? matches : [];
    }

    static async loadModel(filename) {
        if (localStorage.getItem("model")) {
            const modelData = JSON.parse(localStorage.getItem("model"));
            const naiveBayes = new NaiveBayes();

            naiveBayes.total_samples = modelData.total_samples;
            naiveBayes.total_tokens = modelData.total_tokens;
            naiveBayes.subjects = modelData.subjects;
            naiveBayes.tokens = modelData.tokens;
            naiveBayes.stopWords = modelData.stopWords;

            return naiveBayes;
        }

        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error('Failed to fetch the model data');
            }

            const modelData = await response.json();

            if (modelData) {
                const naiveBayes = new NaiveBayes();
                naiveBayes.total_samples = modelData.total_samples;
                naiveBayes.total_tokens = modelData.total_tokens;
                naiveBayes.subjects = modelData.subjects;
                naiveBayes.tokens = modelData.tokens;

                return naiveBayes;
            } else {
                throw new Error('Failed to load the model from JSON.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    removeStopWords(str) {
        str = ' ' + str + ' ';
        const words = str.split(' ');

        for (let c = 0; c < words.length; c++) {
            for (let i = 0; i < this.stopWords.length; i++) {
                if (words[c].toLowerCase() === this.stopWords[i]) {
                    str = str.replace(' ' + words[c] + ' ', ' ');
                    break;
                }
            }
        }

        return str.trim();
    }
    clean(str) {
        str = str.toLowerCase();

        // Remove accents
        str = this.removeAcentos(str);

        // Remove emojis
        str = str.replace(/[\u{1F600}-\u{1F64F}]/gu, '');

        // Remove links
        str = str.replace(/https?:\/\/\S+/g, '');

        // Remove mentions with "#" or "@"
        str = str.replace(/[#@]\S+/g, '');

        // Remove punctuation
        str = str.replace(/[^\w\s]/gu, '');

        return str;
    }
    removeAcentos(str) {
        const acentos = {
            'á': 'a',
            'à': 'a',
            'ã': 'a',
            'â': 'a',
            'é': 'e',
            'è': 'e',
            'ê': 'e',
            'í': 'i',
            'ì': 'i',
            'î': 'i',
            'ó': 'o',
            'ò': 'o',
            'õ': 'o',
            'ô': 'o',
            'ú': 'u',
            'ù': 'u',
            'û': 'u',
            'ç': 'c'
        };

        return str.replace(/[áàãâéèêíìîóòõôúùûç]/g, match => acentos[match] || match);
    }
}
