class ChallengeManager {
    constructor() {
        this.challenges = [];
        this.categories = [];
        this.currentCategory = "all";
        this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    }

    async loadChallenges() {
        try {
            const response = await fetch("data/challenges.json");
            if (!response.ok) throw new Error("Failed to fetch challenges");
            
            const data = await response.json();
            if (!this.validateData(data)) throw new Error("Invalid data structure");
            
            this.challenges = data.challenges;
            this.categories = data.categories;
            this.renderChallenges();
            this.setupCategoryFilters();
        } catch (error) {
            console.error("Error loading challenges:", error);
            this.handleError("Failed to load challenges");
        }
    }

    validateData(data) {
        return data && 
               Array.isArray(data.categories) && 
               Array.isArray(data.challenges) &&
               data.challenges.every(this.validateChallenge);
    }

    validateChallenge(challenge) {
        return challenge &&
               typeof challenge.id === "string" &&
               typeof challenge.title === "string" &&
               typeof challenge.category === "string" &&
               typeof challenge.difficulty === "string" &&
               typeof challenge.description === "string" &&
               typeof challenge.url === "string" &&
               Array.isArray(challenge.tags);
    }

    createChallengeCard(challenge) {
        return `
            <article class="challenge-card glass-card" data-category="${challenge.category}">
                <div class="challenge-header">
                    <h3>${this.sanitizeHTML(challenge.title)}</h3>
                    <div class="challenge-meta">
                        <span class="difficulty ${challenge.difficulty.toLowerCase()}">
                            <i class="fas fa-signal"></i> ${challenge.difficulty}
                        </span>
                        <span class="points">
                            <i class="fas fa-star"></i> ${challenge.points} pts
                        </span>
                    </div>
                </div>
                <div class="challenge-content">
                    <p>${this.sanitizeHTML(challenge.description)}</p>
                    <div class="tags">
                        ${challenge.tags.map(tag => `
                            <span class="tag">${this.sanitizeHTML(tag)}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="challenge-footer">
                    <a href="${this.sanitizeHTML(challenge.url)}" 
                       class="challenge-btn" 
                       target="_blank" 
                       rel="noopener noreferrer">
                        <i class="fas fa-flag"></i> Try Challenge
                    </a>
                </div>
            </article>
        `;
    }

    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    handleError(message) {
        const showcase = document.querySelector('.challenges-showcase');
        if (showcase) {
            showcase.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${this.sanitizeHTML(message)}
                </div>
            `;
        }
    }

    renderChallenges(category = "all") {
        const showcase = document.querySelector('.challenges-showcase');
        if (!showcase) return;

        const filteredChallenges = category === "all" 
            ? this.challenges 
            : this.challenges.filter(c => c.category === category);

        showcase.innerHTML = filteredChallenges
            .map(challenge => this.createChallengeCard(challenge))
            .join('');
    }

    setupCategoryFilters() {
        const categoriesContainer = document.querySelector('.challenge-categories');
        if (!categoriesContainer) return;

        const categories = ["all", ...this.categories];
        categoriesContainer.innerHTML = categories
            .map(category => `
                <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                        data-category="${category}">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            `)
            .join('');

        categoriesContainer.querySelectorAll('.category-btn')
            .forEach(btn => {
                btn.addEventListener('click', () => {
                    categoriesContainer.querySelectorAll('.category-btn')
                        .forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentCategory = btn.dataset.category;
                    this.renderChallenges(this.currentCategory);
                });
            });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const manager = new ChallengeManager();
    manager.loadChallenges();
});