(function() {
    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        Routers: {}
    };

    var vent = _.extend({}, Backbone.Events);
    var movieTitle;
    // model
    App.Models.Movie = Backbone.Model.extend({
        defaults: {
            title: "movie title",
            opening_crawl: "opening crawl",
            director: "director",
            producer: "producer",
            release_date: "release date"
        },
        validate: function(attr) {
            if (!attr.opening_crawl) {
                return 'Open Crawl cannot be blank!!!';
            }

            if (!attr.title) {
                return 'Title Cannot be blank!!';
            }

        }

    });

    App.Models.Character = Backbone.Model.extend({
        defaults: {
            name: "name",
            height: "height",
            mass: "mass",
            hair_color: "hair color",
            skin_color: "skin color",
            eye_color: "eye color",
            birth_year: "birth year",
            gender: "gender"
        },
        validate: function(attr) {
            if (!attr.name) {
                return 'Name Cannot be blank!!';
            }
        }

    });

    //view
    App.Views.MovieView = Backbone.View.extend({
        tagName: 'li',
        className: 'movie',
        id: 'movie-data',

        template: _.template($('#movieTemplate').html()),

        events: {
            'click': 'filterCharater'
        },

        filterCharater: function() {
            var title = this.model.get('title');
            console.log("Filtering out" + title);
            vent.trigger('characters:show', title);
        },

        initialize: function() {
            $('#movie').html(this.render().$el);
        },



        render: function() {
            this.$el.html((this.template(this.model.toJSON())));
            return this;
        }
    });


    App.Views.CharacterView = Backbone.View.extend({
        tagName: 'li',
        className: 'character',
        id: 'character-data',
        template: _.template($('#characterTemplate').html()),

        initialize: function() {
            $('#character').html(this.render().$el);
        },

        render: function() {
            this.$el.html((this.template(this.model.toJSON())));
            return this;
        }
    });

    App.Views.MoviesView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function() {
            $('#movies').html(this.render().$el);
        },
        render: function() {
            this.collection.each(function(movie) {
                var movieView = new App.Views.MovieView({
                    model: movie
                });
                this.$el.append(movieView.render().el)
            }, this);
            return this;
        }
    });

    App.Views.CharactersView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function() {
            //$('#characters').html(this.render().$el);
            vent.on('characters:show', this.showCharacter, this);
        },
        showCharacter: function(title) {
            if (title) {
                movieTitle = title
                $('#characters').html(this.render().$el);
            }

        },
        render: function() {
            this.$el.empty();
            if (movieTitle) {
                this.collection.each(function(character) {
                    var characterView = new App.Views.CharacterView({
                        model: character
                    });
                    var artistNames = characterView.model.get('name');

                    if (movieTitle === artistNames) {
                        this.$el.append(characterView.render().el);
                    }

                }, this);

            }
            return this;
        }
    });


    //collection
    App.Collections.Movies = Backbone.Collection.extend({
        model: App.Models.Movie
    });

    App.Collections.Characters = Backbone.Collection.extend({
        model: App.Models.Character
    });

    //routs
    App.Routers.router = Backbone.Router.extend({
        routes: {
            'movie/:title': 'movie',
            '': 'index'
        },
        index: function(){
            console.log("This is index.html page");
        },
        movie: function(title){
            console.log("You are viewing "+title +" page");
            var collection = movies;
            
            collection.each(function(movie){
                var movieTitleId = movie.get('title');
                if(movieTitleId===title){
                    var movieView = new App.Views.MovieView({
                        model: movie
                    });
                 $('#movie').html(movieView.render().$el);   
                 return false;
                }
            });
        }
    });
    
    $(document).ready(function() {
        movie = new App.Models.Movie();
        character = new App.Models.Character();


        movies = new App.Collections.Movies([{
            title: "Sowmya",
            opening_crawl: "Sowmya crawl",
            director: "Sammy",
            producer: "Sandy",
            release_date: "04/18/2014"
        }, {
            title: "Sandeep",
            opening_crawl: "Sandy",
            director: "Sowmya",
            producer: "Samdy",
            release_date: "02/27/1986"
        }, {
            title: "Srinika",
            opening_crawl: "Srinika crawl",
            director: "SammySandy",
            producer: "SammySandy",
            release_date: "03/22/2017"
        }]);
        characters = new App.Collections.Characters([{
            name: "Sowmya",
            height: "5 feet 7 inch",
            mass: "76 kgs",
            hair_color: "black",
            skin_color: "brown",
            eye_color: "black",
            birth_year: "1989",
            gender: "female"
        }, {
            name: "Sandeep",
            height: "5 Feet 9 inch",
            mass: "90 kgs",
            hair_color: "black",
            skin_color: "black",
            eye_color: "black",
            birth_year: "1986",
            gender: "male"
        }, {
            name: "Srinika",
            height: "1 feet",
            mass: "7 kgs",
            hair_color: "black",
            skin_color: "brown",
            eye_color: "black",
            birth_year: "2017",
            gender: "female"
        }]);


        moviesView = new App.Views.MoviesView({ collection: movies });
        charactersView = new App.Views.CharactersView({ collection: characters });
        
        new App.Routers.router();
        Backbone.history.start();


    });
})();