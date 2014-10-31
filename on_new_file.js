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
  drive = gapi.drive('v2'),
  fs = require('fs');

function OnNewFile(podConfig) {
  this.name = 'on_new_file';
  this.title = 'On A New File',
  this.description = "Triggers when a new file appears in your Google Drive",
  this.trigger = true;
  this.singleton = false;
  this.podConfig = podConfig;
}

OnNewFile.prototype = {};

OnNewFile.prototype.getSchema = function() {
  return {
    "config" : {
      "properties" : {
        "query" : {
          "type" : "string",
          "description" : "Search Query"
        }
      }
    },
    "exports" : {
      "properties" : {
        "id" : {
          "type" : "string",
          "description" : "ID"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
        },
        "originalFilename" : {
          "type" : "string",
          "description" : "Original Filename"
        },
        "iconLink" : {
          "type" : "string",
          "description" : "Icon Link"
        },
        "mimeType" : {
          "type" : "string",
          "description" : "Mime Type"
        },
        "thumbnailLink" : {
          "type" : "string",
          "description" : "Thumbnail Link"
        },
        "createdDate" : {
          "type" : "string",
          "description" : "Created Date"
        },
        "downloadUrl" : {
          "type" : "string",
          "description" : "Download URL"
        }
      }
    }
  }
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
  if (channel.config.query) {
    args.q = ' title contains "' + channel.config.query.replace(/"/g, '\""') + '"';
  }

  drive.files.list(args, function(err, files) {
    var f;
    if (err) {
      next(err);
    } else {
      for (var i = 0; i < files.items.length; i++) {
        f = files.items[i];

        // track new items per query
        f['id_query'] = f['id'] + (args.q || '');
        $resource.dupFilter(f, 'id_query', channel, sysImports, function(err, file) {
          next(err, file);
        });
      }
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OnNewFile;