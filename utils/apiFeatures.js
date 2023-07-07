class APIFeatures {
	constructor(query, queryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}
	search() {
		let keyword = this.queryStr.keyword
			? {
					name: {
						$regex: this.queryStr.keyword,
						$options: "i",
					},
			  }
			: {};
		this.query.find({ ...keyword });
		return this;
	}

	paginate(resPerPage) {
		const currentPage = Number(this.queryStr.page) || 1;
		const skip = resPerPage * (currentPage - 1);
		this.query = this.query.limit(resPerPage).skip(skip);
		return this;
	}

	filter() {
		const queryStrCopy = { ...this.queryStr };

		// Remove Fields from Query
		const removeFields = ["keyword", "limit", "page"];
		removeFields.forEach((field) => delete queryStrCopy[field]);

		this.query.find(queryStrCopy);
		return this;
	}
}

module.exports = APIFeatures;
