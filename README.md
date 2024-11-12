# Icon Generator CLI

A command-line tool to generate custom icons in SVG and PNG formats. Create basic shapes, patterns, or convert emojis into icons with just a few simple prompts.

![Icon Generator Demo](demo.gif)

## Features

- 📐 Basic Shapes: circle, square, triangle, hexagon, star, donut, heart
- 🎨 Pattern Generation: geometric, dots, stripes, zigzag, mosaic
- 😀 Emoji to Icon conversion
- 🎯 Multiple output formats (SVG, PNG)
- 🌈 Custom colors and gradients
- 🖼️ Adjustable sizes
- 🎆 Background customization

## Installation

```bash
# Install globally
npm install -g icon-gen-cli

# Or run directly with npx
npx icon-gen-cli
```

## Usage

```bash
# Start the interactive CLI
icon-gen
```

Follow the interactive prompts to:
1. Choose the type of icon (basic shape, pattern, or emoji)
2. Select specific shape or pattern
3. Set size and colors
4. Choose output format
5. Specify filename

### Example Commands

```bash
# Generate a basic shape
icon-gen
> basic shape
> circle
> 200
> #ff0000
> svg
> my-icon.svg

# Generate from emoji
icon-gen
> emoji
> 🚀
> transparent
> png
> rocket.png

# Generate a pattern
icon-gen
> pattern
> geometric
> 300
> #ff0000,#00ff00,#0000ff
> png
> pattern.png
```

## Examples

### Basic Shapes
![Basic Shapes](examples/basic-shapes.png)

### Patterns
![Patterns](examples/patterns.png)

### Emoji Icons
![Emoji Icons](examples/emoji-icons.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/icon-gen-cli.git

# Install dependencies
cd icon-gen-cli
npm install

# Link for local development
npm link

# Run tests
npm test
```

## License

MIT © [Your Name]

## Credits
- Built with [Node.js](https://nodejs.org/)
- SVG processing using [Sharp](https://sharp.pixelplumbing.com/)

---

Made with ❤️ by Chinmay