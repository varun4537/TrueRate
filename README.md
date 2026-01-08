# TrueRate: Wilson Score Calculator

**TrueRate** is an educational and practical tool designed to solve the "trusted rating" problem. It allows users to compare two products fairly by accounting for the uncertainty inherent in small sample sizes.

Instead of relying on a simple arithmetic average (which favors items with few, perfect ratings), this application calculates the **Wilson Score Interval** (specifically the lower bound of the 95% confidence interval) to determine which product is statistically likely to be better.

![App Screenshot](https://via.placeholder.com/800x400?text=TrueRate+Application+Preview)

## 🧮 The Problem

You are choosing between two products:
*   **Product A**: 5.0 stars (1 review)
*   **Product B**: 4.8 stars (100 reviews)

Most simple sorting algorithms rank Product A higher. However, intuition tells us Product B is the safer bet. Product A has a 100% "success" rate, but the data is extremely thin. Product B has a slightly lower average, but the high volume of data gives us high confidence in its quality.

## 💡 The Solution

This tool implements the **Wilson Score Interval**, a statistical formula used by major platforms (like Reddit, Yelp, and Amazon in various forms) to rank items.

It asks the question: *"Given the ratings we have, what is the 'worst case' true quality of this item with 95% certainty?"*

*   **Product A (1 review)**: The algorithm knows we don't know much. It penalizes the score heavily.
*   **Product B (100 reviews)**: The algorithm is confident. The score stays close to the average.

## ✨ Features

*   **Statistical Comparison**: Real-time calculation of the Wilson Score for two inputs.
*   **AI Auto-Fill**: Paste unstructured text or product descriptions, and the integrated **Google Gemini AI** will extract the product name, rating, and review count automatically.
*   **Interactive Visualization**: Dynamic charts powered by Recharts to visualize the difference between "Nominal Average" and "True Score".
*   **Educational Context**: Built-in explanations based on Evan Miller's famous statistical analysis.
*   **DesignAcademy Theme**: A modern, accessible UI using a soft pastel palette and strong typography.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS (Custom DesignAcademy Theme)
*   **AI Integration**: Google GenAI SDK (`gemini-3-flash-preview`)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up API Key**:
    Ensure your environment has the `API_KEY` variable set for Google Gemini.
4.  **Run the dev server**:
    ```bash
    npm run dev
    ```

## 📚 Further Reading & Related Topics

If you are interested in the mathematics of rating systems, ranking algorithms, and probability, check out these resources:

### The Foundation
*   **[How Not To Sort By Average Rating](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html)** by Evan Miller.
    *   *The seminal article that inspired this tool. It explains the math behind the Wilson Score Interval in the context of web ratings.*

### Advanced Ranking Systems
*   **[Bayesian Average](https://en.wikipedia.org/wiki/Bayesian_average)**
    *   *An alternative method used by sites like IMDB. It adds "dummy" votes to pull items with few reviews toward the global average.*
*   **[Reddit's Ranking Algorithms](https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9)**
    *   *A deep dive into how Reddit sorts comments (Wilson Score) vs. stories (Hot ranking with time decay).*
*   **[Elo Rating System](https://en.wikipedia.org/wiki/Elo_rating_system)**
    *   *Used for zero-sum games (Chess, Video Games). Unlike Wilson (which rates a single item's static quality), Elo rates items based on head-to-head matchups.*

### Statistical Concepts
*   **[Confidence Intervals](https://www.khanacademy.org/math/statistics-probability/confidence-intervals-one-sample)** (Khan Academy)
    *   *Understand what "95% confident" actually means.*
*   **[The Multi-Armed Bandit Problem](https://en.wikipedia.org/wiki/Multi-armed_bandit)**
    *   *A related problem in decision making: exploring new options (low data items) vs. exploiting known good options (high data items).*

---

*Designed and Built with ❤️ using the Google Gemini API.*
