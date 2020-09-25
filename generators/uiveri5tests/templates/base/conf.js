exports.config = {
	profile: "integration",
	baseUrl: "<%= baseUrl %>",<% if (chosenReporters.length) { %>
	reporters: [<% chosenReporters.forEach(function (reporter) { %>
		{name: './reporter/<%= reportersMap[reporter] %>'},<% }) %>
	]<% } %><% if (auth && authMap[auth]) { %>,
	auth: {
		// provide credentials as params when running the test:
		// uiveri5 --params.user=<user> --params.pass=<pass>
		"<%= authMap[auth] %>": {
			user: "${params.user}",
			pass: "${params.pass}"
		}
	}<% } %>
};
