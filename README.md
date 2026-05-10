# Productivity Maxing Website

A modern, professional website for Productivity Maxing - a business performance engineering firm. Built with Next.js, React, Tailwind CSS, and TypeScript.

## Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern Stack** - Next.js with App Router and TypeScript
- **Fast Performance** - Optimized for speed with Next.js best practices
- **Professional UI** - Clean, modern design inspired by industry leaders

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Home (landing page)
│   ├── about/page.tsx     # About page
│   ├── business-tools/    # Business tools showcase
│   ├── consulting/        # Consulting services
│   ├── privacy/page.tsx   # Privacy policy
│   ├── terms/page.tsx     # Terms of service
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── Navigation.tsx     # Navigation component
│   └── Footer.tsx         # Footer component
└── ...
```

## Pages

- **Home** (`/`) - Landing page with product highlights
- **About** (`/about`) - Company mission and vision
- **Business Tools** (`/business-tools`) - Tools and technical stack
- **Consulting** (`/consulting`) - Consulting services and engagement model
- **Privacy** (`/privacy`) - Privacy policy
- **Terms** (`/terms`) - Terms of service

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) - React framework for production
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Linting:** [ESLint](https://eslint.org/) - Code quality

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#1f2937',
      secondary: '#3b82f6',
    },
  },
}
```

### Content
All page content can be edited in the respective `page.tsx` files in `src/app/`.

### Components
Add new components in `src/components/` and import them in pages as needed.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build

### Other Platforms

The site can be deployed to any Node.js hosting platform:
- Railway
- Render
- DigitalOcean
- AWS
- Google Cloud

## Performance

- Next.js Image Optimization for fast image delivery
- Automatic code splitting
- Built-in CSS optimization
- Zero-JS component support with React Server Components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2026 Productivity Maxing. All rights reserved.

## Contact

For questions or support, contact: [legal@productivitymaxing.com](mailto:legal@productivitymaxing.com)
