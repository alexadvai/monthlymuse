# Monthly Muse - Your Personal Financial Advisor

Welcome to Monthly Muse, an intelligent web application designed to help you take control of your monthly finances. By providing a clear, interactive, and personalized overview of your budget, Monthly Muse empowers you to understand your spending habits, discover savings opportunities, and plan for a healthier financial future.

This application was built with Firebase Studio.

## ✨ Key Features

- **Interactive Budgeting:** Easily input your monthly income and adjust your spending across various categories (Rent, Utilities, Food, etc.) using intuitive sliders and inputs.
- **AI-Powered Insights:** Click "Generate Insights" to receive personalized, actionable advice from a sophisticated AI financial advisor. Suggestions are categorized by impact ("High Impact," "Quick Win," "Good Habit") to help you prioritize.
- **Visual Expense Breakdown:** A dynamic donut chart gives you an at-a-glance view of where your money is going, making it easy to spot your biggest areas of spending.
- **Financial Health Score:** Receive a score from 0 to 100 that benchmarks your current financial standing, along with a brief, encouraging analysis.
- **Unlockable Achievements:** Gamify your savings journey! Earn badges for smart financial decisions like maintaining a high savings rate or keeping housing costs low.
- **12-Month Savings Projection:** Visualize your long-term financial growth with a line chart that projects your potential savings over the next year based on your current budget and suggested changes.
- **Dynamic Category Suggestions:** If your "Other" spending is high, the AI will suggest creating a more specific category to help you track expenses more effectively.

## 🛠️ Tech Stack

Monthly Muse is built with a modern, robust technology stack:

- **Frontend:** [Next.js](https://nextjs.org/) with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI & Generative Features:** [Genkit](https://firebase.google.com/docs/genkit) with the [Google Gemini](https://deepmind.google/technologies/gemini/) family of models.
- **Charts:** [Recharts](https://recharts.org/)

## 🚀 Getting Started

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment variables:**
    - Create a `.env` file in the root of the project.
    - Add your Gemini API key: `GOOGLE_API_KEY=your_api_key_here`
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the app.
