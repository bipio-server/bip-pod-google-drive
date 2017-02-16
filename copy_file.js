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

function CopyFile() {}

CopyFile.prototype = {};

CopyFile.prototype.fetchPage = function(req, args, next) {
  var self = this;
  req(args, function(err, files) {
    if (err) {
      next(err);
    } else if (files.items) {
      for (var i = 0; i < files.items.length; i++) {
        next(false, files.items[i]);
      }

      if (files && files.nextPageToken) {
        args.pageToken = files.nextPageToken;
        self.fetchPage(req, args, next);
      }
    }
  });
}

CopyFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    auth = self.pod.getOAuthClient(sysImports),
    args = {
      auth : self.pod.getOAuthClient(sysImports),
      q : ' title="' + imports.file_title + '"'
    };

  this.fetchPage(drive.files.list, args, function(err, file) {
    if (err) {
      next(err);
    } else {
      drive.files.copy(
        {
          fileId : file.id,
          resource : {
            title : imports.dest_file_title
          },
          auth : args.auth
        },
        function(err, resp) {
          next(err, resp);
        }
      );
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = CopyFile;