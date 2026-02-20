export namespace main {
	
	export class Note {
	    filename: string;
	    title: string;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.filename = source["filename"];
	        this.title = source["title"];
	    }
	}

}

