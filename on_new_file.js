/**
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var gapi = require('googleapis'),
  drive = gapi.drive('v2');

function OnNewFile() {}

OnNewFile.prototype = {};

OnNewFile.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'id_query', channel, sysImports, function(err, file) {
        next(err, file);
      });
    }
  });
}

OnNewFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    $resource = this.$resource,
    log = $resource.log,
    pod = this.pod,
    args = {
      auth : self.pod.getOAuthClient(sysImports)
    }

  // @see https://developers.google.com/drive/web/search-parameters
  if (imports.query) {
    args.q = ' title contains "' + imports.query.replace(/"/g, '\""') + '"';
  }

  drive.files.list(args, function(err, files) {
    var f;
    if (err) {
      next(err);
    } else {
      for (var i = 0; i < files.items.length; i++) {
        file = files.items[i];

        // track new items per query
        file['id_query'] = file['id'] + (args.q || '');
        next(err, file);
      }
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnNewFile;
