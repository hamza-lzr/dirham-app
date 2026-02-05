# Currency Converter - Morocco Edition

A modern, responsive web application that converts various world currencies to Moroccan currency denominations: Dirham (MAD), Franc (cents), and Ryal.

## Features

- **Multi-Currency Support**: Convert from 9 major currencies (USD, EUR, GBP, JPY, INR, AED, SAR, EGP, TND)
- **Three Currency Types**:
  - **Moroccan Dirham (د.م.)** - Main currency
  - **Moroccan Franc (ف)** - Cents (1 Dirham = 100 Francs)
  - **Moroccan Ryal (ر)** - Alternative denomination (1 Dirham = 20 Ryals)
- **Real-time Conversion**: Instant calculations as you type
- **Beautiful UI**: Built with React and styled with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Exchange Rates

The converter uses the following approximate exchange rates to Moroccan Dirham:

- 1 USD = 10.5 MAD
- 1 EUR = 11.5 MAD
- 1 GBP = 13.2 MAD
- 1 JPY = 0.072 MAD
- 1 INR = 0.126 MAD
- 1 AED = 2.86 MAD
- 1 SAR = 2.8 MAD
- 1 EGP = 0.34 MAD
- 1 TND = 3.4 MAD

*Note: These are approximate rates for demonstration. For real-world use, integrate with a live currency exchange API.*

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build
```

## Technologies Used

- **React** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **React Scripts** - Build tooling

## Development

The app runs on `http://localhost:3000` in development mode. The page will reload when you make changes.

### Project Structure

```
src/
├── App.js              # Main app component
├── CurrencyConverter.jsx - Currency converter component
├── index.css           - Tailwind CSS imports and global styles
└── index.js            - React entry point
```

## How to Use

1. Enter the amount you want to convert
2. Select the currency from the dropdown
3. View real-time conversions to all three Moroccan currency types

## Future Enhancements

- Integrate with a live currency exchange API (e.g., Open Exchange Rates, Fixer.io)
- Add more currencies
- Reverse conversion (from MAD to other currencies)
- Conversion history
- Offline support

## License

This project is open source and available under the MIT License.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
