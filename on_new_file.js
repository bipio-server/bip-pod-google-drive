/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
