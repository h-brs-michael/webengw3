ccm.component( {

  name: 'item-verwaltung',
  config: {
    html:  [ ccm.store, { local: 'templates.json' } ],
    key:  'item-verwaltung-key',
    style: [ ccm.load, 'item-verwaltung.css' ],
    user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user2.js' ],
    store: [ ccm.store , { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'item-verwaltung'} ],
  },

  Instance: function () {

    var self = this;
    var login = null;

    //init:
    self.init = function ( callback ) {
      self.store.onChange = function () {
        self.render();
      };

      callback();
    }

    //render:
    self.render = function ( callback ) {

      var element = ccm.helper.element( self );
      element.html("<h2>Login Required</h2>");

      //Login:
      self.user.login( function () {  // Nutzung der user-Instanz für Authentifizierung

        var login = self.user.data().key;

      self.store.get( self.key+login, function ( dataset ) {
        if (dataset === null) {
          console.log("store = null");
          self.store.set({
            key: self.key+login,
            items: []
          }, proceed);
        } else {
        console.log("store != null");
        proceed(dataset);
      }
        function proceed(dataset) {

          element.html(ccm.helper.html( self.html.get('main') ));

          var header_div = ccm.helper.find( self, '.header' );

          header_div.append(ccm.helper.html( self.html.get( 'header' ), {

            text: "Items von "+login

          }) );

          //items hinzufügen
          var items_div = ccm.helper.find( self, '.items' );

          for ( var i = 0; i < dataset.items.length; i++ ) {

            var item = dataset.items[ i ];
            items_div.append( ccm.helper.html( self.html.get( 'item' ), {

              id: i,

              text: ccm.helper.val( item.text ),

              onclick: function () {

                console.log("clicked: "+this.id);

                if(this.id != -1) {
                  dataset.items.splice(this.id, 1);
                }

                self.store.set( dataset, function () { self.render(); } );


              }
            } ) );
          }

          //item-submit
          var items_div = ccm.helper.find( self, '.items-input' );

          items_div.append ( ccm.helper.html( self.html.get( 'input' ), {
            onsubmit: function () {

              var value = ccm.helper.val( ccm.helper.find( self, '#input-text' ).val().trim() );
              if ( value === '' ) return false;

              dataset.items.push( { text: value } );

              self.store.set( dataset, function () { self.render(); } );
              return false;
            }

          } ) );

          if ( callback ) callback();
        }

        //login end
      })

    } );
    }

  },


} );
