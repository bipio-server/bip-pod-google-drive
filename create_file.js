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

function CreateFile() {}

CreateFile.prototype = {};

CreateFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    $resource = this.$resource,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports);

  for (var i = 0; i < contentParts._files.length; i++) {
    (function(file) {
      $resource.file.get(file, function(err, fileStruct, stream) {

        if (err) {
          next(err);
        } else {
          var args = {
            auth : auth,
            resource : {
              title: fileStruct.name,
              mimeType: fileStruct.type
            },
            media : {
              mimeType: fileStruct.type,
              body : stream
            }
          }

          if (imports.folder_id) {
            args.resource.parents = [
              { id : imports.folder_id }
            ]
          }

          drive.files.insert(args, function(err, result) {
            next(err, result);
          });
        }
      });
    })(contentParts._files[i]);
  }
}

// -----------------------------------------------------------------------------
module.exports = CreateFile;