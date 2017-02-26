var endpoint = "/endpoints";


module.exports = {
    setup: (app) => {
        /* CHARACTERCLASS ENDPOINT */
        console.log("Registering endpoint: " + endpoint);
        app.get(endpoint, (req, res) => {
            var result = [
				{"alias": "class", "path":"class", "guid": true, "relation": "classes"},
				{"alias": "classdependencyfeats", "path":"class/dependency/feats", "guid": true, "relation": "class"},
				{"alias": "classdependencyraces", "path":"class/dependency/races", "guid": true, "relation": "class"},
				{"alias": "classdependencyskills", "path":"class/dependency/skills", "guid": true, "relation": "class"},
				{"alias": "classskills", "path":"class/skills", "guid": true, "relation": "class"},
				{"alias": "classspells", "path":"class/spells", "guid": true, "relation": "class"},
				{"alias": "classes", "path":"classes", "guid": false, "relation": ""},
				{"alias": "deities", "path":"deities", "guid": null, "relation": ""},
                {"alias": "editions", "path":"editions", "guid": null, "relation": ""},
				{"alias": "feat", "path":"feat", "guid": true, "relation": "feats"},
				{"alias": "featcategories", "path":"feat/categories", "guid": true, "relation": "feat"},
				{"alias": "featdependencyfeats", "path":"feat/dependency/feats", "guid": true, "relation": "feat"},
				{"alias": "featprerequisitefeats", "path":"feat/prerequisite/feats", "guid": true, "relation": "feat"},
				{"alias": "featprerequisiteskills", "path":"feat/prerequisite/skills", "guid": true, "relation": "feat"},
				{"alias": "featrelatedfeats", "path":"feat/related/feats", "guid": true, "relation": "feat"},
				{"alias": "featrequirementsspecial", "path":"feat/requirements/special", "guid": true, "relation": "feat"},
				{"alias": "feats", "path":"feats", "guid": false, "relation": ""},
				{"alias": "featcategories", "path":"feats/categories", "guid": false, "relation": ""},
				{"alias": "featcategoryfeats", "path":"feats/categories/feats", "guid": true, "relation": "fetcategories"},
				{"alias": "items", "path":"items", "guid": null, "relation": ""},
				{"alias": "languages", "path":"languages", "guid": null, "relation": ""},
				{"alias": "monsters", "path":"monsters", "guid": null, "relation": ""},
				{"alias": "race", "path":"race", "guid": true, "relation": "races"},
				{"alias": "races", "path":"races", "guid": false, "relation": ""},
				{"alias": "rulebooks", "path":"rulebooks", "guid": null, "relation": ""},
				{"alias": "skill", "path":"skill", "guid": true, "relation": "skills"},
				{"alias": "skills", "path":"skills", "guid": false, "relation": ""},
				{"alias": "skilltricks", "path":"skills/tricks", "guid": false, "relation": ""},
				{"alias": "spell", "path":"spell", "guid": true, "relation": "spells"},
				{"alias": "spellclasses", "path":"spell/classes", "guid": true, "relation": "spell"},
				{"alias": "spelldescriptors", "path":"spell/descriptors", "guid": true, "relation": "spell"},
				{"alias": "spelldomains", "path":"spell/domains", "guid": true, "relation": "spell"},
				{"alias": "spells", "path":"spells", "guid": false, "relation": ""},
				{"alias": "spelldescriptors", "path":"spells/descriptors", "guid": false, "relation": ""},
				{"alias": "spelldescriptorspells", "path":"spells/descriptors/spells", "guid": true, "relation": "spelldescriptors"},
				{"alias": "spelldomains", "path":"spells/domains", "guid": false, "relation": ""},
				{"alias": "spelldomainspells", "path":"spells/domains/spells", "guid": true, "relation": "spelldomains"},
				{"alias": "spellschools", "path":"spells/schools", "guid": false, "relation": ""},
				{"alias": "spellschoolspells", "path":"spells/schools/spells", "guid": true, "relation": "spellschools"},
				{"alias": "spellsubschools", "path":"spells/subschools", "guid": false, "relation": ""},
				{"alias": "spellsubschoolspells", "path":"spells/subschools/spells", "guid": true, "relation": "spellsubschools"}];
			res.json(result);
        });
    }
}