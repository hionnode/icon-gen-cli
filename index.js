#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs/promises';
import sharp from 'sharp';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

const generateBasicSVGIcon = (size, color, shape) => {
    const shapes = {
        circle: `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="${color}"/>`,
        square: `<rect x="${size / 6}" y="${size / 6}" width="${size / 1.5}" height="${size / 1.5}" fill="${color}"/>`,
        triangle: `<polygon points="${size / 2},${size / 6} ${size / 6},${size * 5 / 6} ${size * 5 / 6},${size * 5 / 6}" fill="${color}"/>`,
        hexagon: `<polygon points="${size / 2},${size / 6} ${size * 5 / 6},${size / 3} ${size * 5 / 6},${size * 2 / 3} ${size / 2},${size * 5 / 6} ${size / 6},${size * 2 / 3} ${size / 6},${size / 3}" fill="${color}"/>`,
        star: createStarPath(size, color),
        donut: createDonutPath(size, color),
        heart: createHeartPath(size, color)
    };

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    ${shapes[shape] || shapes.circle}
  </svg>`;
};

const createStarPath = (size, color) => {
    const points = [];
    const outerRadius = size / 3;
    const innerRadius = size / 6;
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / 5) * i;
        const x = size / 2 + radius * Math.cos(angle);
        const y = size / 2 + radius * Math.sin(angle);
        points.push(`${x},${y}`);
    }
    return `<polygon points="${points.join(' ')}" fill="${color}"/>`;
};

const createDonutPath = (size, color) => {
    const outerRadius = size / 3;
    const innerRadius = size / 6;
    return `
    <circle cx="${size / 2}" cy="${size / 2}" r="${outerRadius}" fill="${color}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${innerRadius}" fill="white"/>
  `;
};

const createHeartPath = (size, color) => {
    const scale = size / 100;
    return `
    <path d="M ${50 * scale},${80 * scale} 
    C ${50 * scale},${80 * scale} ${20 * scale},${50 * scale} ${20 * scale},${30 * scale}
    C ${20 * scale},${15 * scale} ${30 * scale},${10 * scale} ${50 * scale},${30 * scale}
    C ${70 * scale},${10 * scale} ${80 * scale},${15 * scale} ${80 * scale},${30 * scale}
    C ${80 * scale},${50 * scale} ${50 * scale},${80 * scale} ${50 * scale},${80 * scale}"
    fill="${color}"/>
  `;
};

const generatePatternSVG = (size, colors) => {
    const patterns = {
        geometric: generateGeometricPattern(size, colors),
        dots: generateDotsPattern(size, colors),
        stripes: generateStripesPattern(size, colors),
        zigzag: generateZigzagPattern(size, colors),
        mosaic: generateMosaicPattern(size, colors)
    };

    return patterns;
};

const generateGeometricPattern = (size, colors) => {
    let pattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    const gridSize = size / 5;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = Math.random() > 0.5 ? 'circle' : 'rect';
            if (shape === 'circle') {
                pattern += `<circle cx="${i * gridSize + gridSize / 2}" cy="${j * gridSize + gridSize / 2}" r="${gridSize / 3}" fill="${color}"/>`;
            } else {
                pattern += `<rect x="${i * gridSize + gridSize / 4}" y="${j * gridSize + gridSize / 4}" width="${gridSize / 2}" height="${gridSize / 2}" fill="${color}"/>`;
            }
        }
    }

    return pattern + '</svg>';
};

const generateDotsPattern = (size, colors) => {
    let pattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    const spacing = size / 10;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const radius = Math.random() * (spacing / 3) + spacing / 6;
            pattern += `<circle cx="${i * spacing + spacing / 2}" cy="${j * spacing + spacing / 2}" r="${radius}" fill="${color}"/>`;
        }
    }

    return pattern + '</svg>';
};

const generateStripesPattern = (size, colors) => {
    let pattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    const stripeWidth = size / 20;

    for (let i = 0; i < 20; i++) {
        const color = colors[i % colors.length];
        pattern += `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="${size}" fill="${color}"/>`;
    }

    return pattern + '</svg>';
};

const generateZigzagPattern = (size, colors) => {
    let pattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    const points = [];
    const steps = 10;
    const stepSize = size / steps;

    for (let i = 0; i <= steps; i++) {
        const x = i * stepSize;
        const y = i % 2 === 0 ? 0 : size;
        points.push(`${x},${y}`);
    }

    colors.forEach((color, index) => {
        const offset = (size / colors.length) * index;
        pattern += `<polyline points="${points.join(' ')}" stroke="${color}" stroke-width="${size / colors.length}" fill="none" transform="translate(0,${offset})"/>`;
    });

    return pattern + '</svg>';
};

const generateMosaicPattern = (size, colors) => {
    let pattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    const tileSize = size / 8;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = Math.random();
            if (shape < 0.33) {
                // Triangle
                pattern += `<polygon points="${i * tileSize},${j * tileSize} ${(i + 1) * tileSize},${j * tileSize} ${i * tileSize},${(j + 1) * tileSize}" fill="${color}"/>`;
            } else if (shape < 0.66) {
                // Quarter circle
                pattern += `<path d="M ${i * tileSize},${j * tileSize} A ${tileSize},${tileSize} 0 0,1 ${(i + 1) * tileSize},${(j + 1) * tileSize} L ${i * tileSize},${(j + 1) * tileSize} Z" fill="${color}"/>`;
            } else {
                // Rectangle
                pattern += `<rect x="${i * tileSize}" y="${j * tileSize}" width="${tileSize}" height="${tileSize}" fill="${color}"/>`;
            }
        }
    }

    return pattern + '</svg>';
};

const questions = [
    {
        type: 'list',
        name: 'mode',
        message: 'What type of icon would you like to generate?',
        choices: ['basic shape', 'pattern'],
        default: 'basic shape',
    },
    {
        type: 'list',
        name: 'shape',
        message: 'Choose a shape:',
        choices: ['circle', 'square', 'triangle', 'hexagon', 'star', 'donut', 'heart'],
        when: answers => answers.mode === 'basic shape',
    },
    {
        type: 'list',
        name: 'pattern',
        message: 'Choose a pattern:',
        choices: ['geometric', 'dots', 'stripes', 'zigzag', 'mosaic'],
        when: answers => answers.mode === 'pattern',
    },
    {
        type: 'input',
        name: 'size',
        message: 'What size should the icon be? (in pixels)',
        default: '200',
        validate: (input) => {
            const size = parseInt(input);
            return !isNaN(size) && size > 0 || 'Please enter a valid positive number';
        },
    },
    {
        type: 'input',
        name: 'color',
        message: 'What color would you like? (hex code or color name)',
        default: '#000000',
        validate: (input) => {
            return /^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$/.test(input) ||
                'Please enter a valid hex color code (#RRGGBB) or color name';
        },
        when: answers => answers.mode === 'basic shape',
    },
    {
        type: 'number',
        name: 'numColors',
        message: 'How many colors would you like in your pattern? (2-5)',
        default: 3,
        validate: (input) => {
            return input >= 2 && input <= 5 || 'Please enter a number between 2 and 5';
        },
        when: answers => answers.mode === 'pattern',
    },
    {
        type: 'input',
        name: 'colors',
        message: (answers) => `Enter ${answers.numColors} colors (hex codes or names, separated by commas):`,
        default: '#ff0000,#00ff00,#0000ff',
        validate: (input, answers) => {
            const colors = input.split(',').map(c => c.trim());
            if (colors.length !== answers.numColors) {
                return `Please enter exactly ${answers.numColors} colors`;
            }
            return colors.every(c => /^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$/.test(c)) ||
                'Please enter valid hex codes (#RRGGBB) or color names';
        },
        when: answers => answers.mode === 'pattern',
    },
    {
        type: 'list',
        name: 'format',
        message: 'What format would you like?',
        choices: ['svg', 'png'],
        default: 'svg',
    },
    {
        type: 'input',
        name: 'filename',
        message: 'What should we name the file?',
        default: (answers) => `icon.${answers.format}`,
        validate: (input) => {
            if (!input.trim()) {
                return 'Filename cannot be empty';
            }
            return true;
        },
    },
];

async function main() {
    console.log(chalk.blue.bold('\n🎨 Welcome to the Icon Generator V3! 🎨\n'));

    try {
        const answers = await inquirer.prompt(questions);

        if (!answers.filename.endsWith(`.${answers.format}`)) {
            answers.filename = `${answers.filename}.${answers.format}`;
        }

        const spinner = createSpinner('Generating your icon...').start();

        let output;
        if (answers.mode === 'basic shape') {
            output = generateBasicSVGIcon(parseInt(answers.size), answers.color, answers.shape);
        } else {
            const colors = answers.colors.split(',').map(c => c.trim());
            output = generatePatternSVG(parseInt(answers.size), colors)[answers.pattern];
        }

        if (answers.format === 'png') {
            const pngBuffer = await sharp(Buffer.from(output))
                .png()
                .resize(parseInt(answers.size), parseInt(answers.size))
                .toBuffer();
            await fs.writeFile(answers.filename, pngBuffer);
        } else {
            await fs.writeFile(answers.filename, output);
        }

        spinner.success({ text: chalk.green(`Icon successfully generated as ${answers.filename}!`) });

        console.log(chalk.cyan('\nIcon details:'));
        console.log(chalk.yellow(`Mode: ${answers.mode}`));
        if (answers.mode === 'basic shape') {
            console.log(chalk.yellow(`Shape: ${answers.shape}`));
            console.log(chalk.yellow(`Color: ${answers.color}`));
        } else {
            console.log(chalk.yellow(`Pattern: ${answers.pattern}`));
            console.log(chalk.yellow(`Colors: ${answers.colors}`));
        }
        console.log(chalk.yellow(`Size: ${answers.size}px`));
        console.log(chalk.yellow(`Format: ${answers.format}`));

    } catch (error) {
        console.error(chalk.red('\n❌ Error generating icon:'), error.message);
        process.exit(1);
    }
}

main();