#!/usr/bin/env node
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

function run(cmd, args) {
	const res = spawnSync(cmd, args, { stdio: 'inherit' });
	if (res.status !== 0) process.exit(res.status);
}

function toGif(input, output, { fps = 15, width } = {}) {
	const vfParts = [];
	vfParts.push(`fps=${fps}`);
	if (width) vfParts.push(`scale=${width}:-1:flags=lanczos`);
	const vf = vfParts.join(',');

	// single-pass palette generation + use using split
	const filter = `${vf},split[s0][s1];[s0]palettegen=stats_mode=diff[pal];[s1][pal]paletteuse`;

	const args = ['-y', '-nostdin', '-i', input, '-vf', filter, output];
	console.log(`Converting ${input} -> ${output} (fps=${fps}${width ? `, width=${width}` : ''})`);
	run(ffmpegPath, args);
}

function isDirectory(p) {
	try {
		return fs.statSync(p).isDirectory();
	} catch {
		return false;
	}
}

function findMp4Files(dir) {
	const files = fs.readdirSync(dir);
	return files.filter((f) => /\.mp4$/i.test(f)).map((f) => path.join(dir, f));
}

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error('Usage: node scripts/mp42gif.js <file_or_dir> [outdir] [fps] [width]');
		process.exit(1);
	}

	const input = args[0];
	const outdir = args[1] || null;
	const fps = args[2] ? Number(args[2]) : 15;
	const width = args[3] ? Number(args[3]) : undefined;

	let inputs = [];
	if (isDirectory(input)) {
		inputs = findMp4Files(input);
		if (inputs.length === 0) {
			console.log(`No .mp4 files found in ${input}`);
			return; // nothing to do
		}
	} else {
		if (!fs.existsSync(input)) {
			console.error(`Input not found: ${input}`);
			process.exit(1);
		}
		inputs = [input];
	}

	for (const inp of inputs) {
		const base = path.basename(inp).replace(/\.mp4$/i, '.gif');
		const out = outdir ? path.join(outdir, base) : path.join(path.dirname(inp), base);
		toGif(inp, out, { fps, width });
	}
}

if (
	import.meta.url === `file://${process.argv[1]}` ||
	import.meta.url.endsWith('/scripts/mp42gif.js')
) {
	main();
}
