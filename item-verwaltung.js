/** blank.js */
ccm.component( {

  name: 'item-verwaltung',
  config: {
    html:  [ ccm.store, { local: 'templates.json' } ],
    key:  'item-verwaltung-key',
    style: [ ccm.load, 'item-verwaltung.css' ],
    store: [ ccm.store , { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'item-verwaltung' } ],
    user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user.js' ]
  },

  Instance: function () {

    var self = this;

    //init:
    self.init = function ( callback ) {
      self.store.onChange = function () {
        self.render();
      };
      callback();
    };

    //render:
    self.render = function ( callback ) {

      var element = ccm.helper.element( self );
      
      self.store.get( self.key, function ( dataset ) {
        if (dataset === null) {
          console.log("store = null");
          self.store.set({
            key: self.key,
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

            text: "Items von "/*+self.user.data().key*/

          }) );



          //items hinzufügen
          var items_div = ccm.helper.find( self, '.items' );

          console.log("length: "+dataset.items.length);

          for ( var i = 0; i < dataset.items.length; i++ ) {
            console.log("add item: "+i);
            var item = dataset.items[ i ];
            items_div.append( ccm.helper.html( self.html.get( 'item' ), {

              id: i,

              text: ccm.helper.val( item.text ),

              onclick: function () {

                console.log("checkbox is clicked");
                //console.log("box: "+ccm.helper.find(self, "#2"));
                //console.log(id);
                console.log(this.id);

                if(this.id != -1) {
                  dataset.items.splice(this.id, 1);
                }

                //dataset.items.pop();
                console.log(dataset.items);

                self.store.set( dataset, function () { self.render(); } );


              }
            } ) );
          }

          //item-submit
          var items_div = ccm.helper.find( self, '.items-input' );

          items_div.append ( ccm.helper.html( self.html.get( 'input' ), {
            onsubmit: function () {

              console.log("button");
              //console.log(ccm.helper.val( ccm.helper.find(self, '#input-text') ).val().trim());
              var value = ccm.helper.val( ccm.helper.find( self, '#input-text' ).val().trim() );
              console.log("value: "+value);
              if ( value === '' ) return false;

              console.log("button value: "+value);
              dataset.items.push( { text: value } );

              self.store.set( dataset, function () { self.render(); } );
              return false;
            }

          } ) );

          if ( callback ) callback();
        }

      })

    }

  },


} );
