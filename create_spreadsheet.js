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

function CreateSpreadsheet(podConfig) {
  this.name = 'create_spreadsheet';
  this.title = 'Create a Spreadsheet',
  this.description = "Create a Spreadsheet on Google Drive",
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

CreateSpreadsheet.prototype = {};

CreateSpreadsheet.prototype.getSchema = function() {
  return {
    "imports" : {
      "properties" : {
        "headers" : {
          "type" : "string",
          "description" : "Column Headers"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
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

CreateSpreadsheet.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports);


  drive.files.insert({
      auth : auth,
      convert : true,
      resource : {
        title : imports.title,
        mimeType : 'text/csv'
      },
      media : {
        mimeType : 'text/csv',
        body : imports.headers + '\n'
      }
    }, function(err, result) {
      console.log(arguments);
      next(err, result);
    });
}

// -----------------------------------------------------------------------------
module.exports = CreateSpreadsheet;