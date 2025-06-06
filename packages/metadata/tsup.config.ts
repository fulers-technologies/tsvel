import { defineConfig } from "tsup"
import { readFileSync } from "fs"
import { join } from "path"

// Read package.json to extract version and dependencies
const packageJson = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"))

// Extract package information
const { name, version, author, license } = packageJson

// Extract all dependencies to mark as external
const allDependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
]

// Create a banner for the output files
const banner = `/**
 * ${name} v${version}
 * 
 * Standalone metadata management inspired by inversiland metadata for the TSVEL Framework
 * 
 * @license ${license}
 * @copyright ${new Date().getFullYear()} ${author}
 */
`

export default defineConfig({
  // Specify the entry points for the build
  entry: ["src/index.ts"],

  // Output formats (CommonJS and ES Modules)
  format: ["cjs", "esm"],

  // Generate declaration files (.d.ts)
  // @todo: fix here
  // dts: true,

  // Disable code splitting for better compatibility
  splitting: false,

  // Generate source maps for debugging
  sourcemap: true,

  // Clean the output directory before building
  clean: true,

  // Don't minify the output for better readability
  minify: false,

  // Enable tree shaking to remove unused code
  treeshake: true,

  // Mark all dependencies as external to avoid bundling them
  external: allDependencies,

  // Add the banner to all output files
  banner: {
    js: banner,
  },

  // Additional options for better developer experience
  onSuccess: 'echo "Build completed successfully!"',
})

