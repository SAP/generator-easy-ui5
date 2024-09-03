if (process.env.HUSKY_SKIP || process.env.NODE_ENV === "production") {
	process.exit(0);
} else {
	process.exit(1);
}
