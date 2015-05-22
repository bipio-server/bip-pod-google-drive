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