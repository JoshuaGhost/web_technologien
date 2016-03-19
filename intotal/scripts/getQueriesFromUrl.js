function getQueriesFromUrl (url) {
	var queries = [], kvPairs;
	var kvPairs = url.slice(url.indexOf('?')+1).split('&');
	for (var i = 0; i < kvPairs.length; i++) {
		kvPair = kvPairs[i].split('=');
		queries.push(kvPair[0]);
		queries[kvPair[0]] = kvPair[1];
	}
	return queries;
}