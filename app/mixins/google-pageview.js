import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Mixin.create({
  currentUser: Ember.inject.service(),

  beforePageviewToGA: function (ga) {

  },

  pageviewToGA: Ember.on('didTransition', function(page, title) {
    var page = page ? page : this.get('url');
    var title = title ? title : this.get('url');
    var admin = this.get('currentUser.user.admin');

    if (Ember.get(ENV, 'googleAnalytics.webPropertyId') != null && !admin) {
      var trackerType = Ember.getWithDefault(ENV, 'googleAnalytics.tracker', 'analytics.js');

      if (trackerType === 'analytics.js') {
        var globalVariable = Ember.getWithDefault(ENV, 'googleAnalytics.globalVariable', 'ga');

        this.beforePageviewToGA(window[globalVariable]);

        window[globalVariable]('send', 'pageview', {
          page: page,
          title: title
        });
      } else if (trackerType === 'ga.js') {
        window._gaq.push(['_trackPageview']);
      }
    }
  })

});
