// Load supported devices from YAML file
function loadSupportedDevices() {
    $(document).ready(function () {
        $('#supported').DataTable({
            fixedHeader: true,
            responsive: {
                details: false
            },
            "paging": false,
            "order": [[0, "asc"]],
            "ajax": {
                "type": "GET",
                "url": 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/devices.yml',
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml',
                "dataSrc": function (yml) {
                    var devicesList = [];
                    Object.entries(yml).forEach(function ([codename, name]) {
                        devicesList.push({ 'name': name, 'codename': codename });
                    })
                    return devicesList;
                }
            },
            columns: [
                { data: 'name', className: "all" },
                {
                    data: 'codename', className: "all",
                    "render": function (data) {
                        return '<a href="/downloads/latest/' + data + '">' + data + '</a>';
                    }
                }
            ]
        });
    });
};

// Load all latest downloads
function loadLatestDownloads(path) {
    $(document).ready(function () {
        var downloads = new Array();
        fetchData();
        function updateDownloads(data) {
            Array.from(data).forEach(function (item) {
                downloads.push(item);
            });
        }
        function fetchData() {
            $.when(
                $.ajax({
                    url: 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/' + path + '.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                })
            ).done(function (latest) {
                updateDownloads(latest);
                DrawTable(downloads);
            })
        }
        function DrawTable(downloads) {
            $('#downloads').DataTable({
                data: downloads,
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[7, "desc"]],
                columnDefs: [
                    { type: 'file-size', targets: 6 },
                    { type: 'date-eu', targets: 7 }
                ],
                columns: [
                    { data: 'device', className: "all" },
                    { data: 'codename', className: "min-mobile-l" },
                    { data: 'region',
                    className: "all",
                    "render": function (data) {
                        return '<a href="/downloads/latest/' + data + '" target="_blank">' + data + '</a>';
                    }
                },
                    { data: 'system', className: "min-mobile-l" },
                    { data: 'version', className: "all" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    },
                    { data: 'size', className: "min-mobile-l" },
                    { data: 'date', className: "min-mobile-l" }
                ]
            });
        };
    })
};

// Load latest downloads for a device
function loadLatestFrom(path) {
    $.when(
        $.ajax({
            url: 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/' + path + '.yml',
            async: true,
            converters: {
                'text yaml': function (result) {
                    return jsyaml.load(result);
                }
            },
            dataType: 'yaml'
        })
    ).done(function (latest) {
        $('#device').text(latest.device);
        $('#codename').text(latest.codename);
        $('#region').text(latest.region);
        $('#system').text(latest.system);
        $('#version').text(latest.version);
        $('#filename').text(latest.download.split('/').slice(-1).join());
        $('#download').click(openInTab(latest.download));
        $('#size').text(latest.size);
        $('#date').text(latest.date);
        $('#md5').text(latest.md5);
        $('#changelog_text').html(latest.changelog.replace(/\*\*\:/g, ':</b>').replace(/\*\*/g, '<b>').replace(/\n/g, '<br>'));
    })
}

function loadLatest(codename) {
    var downloads = new Array();
    fetchData();
    function updateDownloads(data) {
        Array.from(data).forEach(function (item) {
            if (item.codename == codename) {
                downloads.push(item);
            }
        });
    }
    function fetchData() {
        $.when(
            $.ajax({
                url: 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/latest.yml',
                async: true,
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml'
            })
        ).done(function (latest) {
            updateDownloads(latest);
            WriteDownloads(downloads);
        })
    }
    function WriteDownloads(downloads) {
        downloads_html = "";
        downloads.forEach(function (item, index) {
            device = item.codename + '_' + index
            downloads_html += '<div class="card card-body"><ul class=list-unstyled><li><h5><b>Device: </b>' + item.device +
                '</h5><li><h5><b>Codename: </b>' + item.codename + '</h5><li><h5><b>Region: </b>' +
                '<a href="/downloads/latest/' + item.region + '" target="_blank">' + item.region + '</a>' +
                '</h5><li><h5><b>System: </b>' + item.system + '</h5><li><h5><b>Version: </b>' + item.version +
                '</h5><li><h5><b>Size: </b>' + item.size + '</h5><li><h5><b>Release Date: </b>' + item.date +
                '</h5><li><h5><b>Package Name: </b><span id=filename class=text-danger>' + item.download.split('/').slice(-1).join() +
                '</span></h5><li><h5><b>MD5: </b><span id=md5 class=text-muted>' + item.md5 +
                '</span></h5><li><h5><b>Link: </b><button type="button" id="download" class="btn btn-warning btn-sm" onclick="openInTab(\'' +
                item.download + '\')">' + '<i class=material-icons>file_download</i>Download</button></h5></li>' +
                '<li><h5><b>Changelog: </b><a href="#' + device + '_changelog" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="' +
                device + '_changelog"><i class="material-icons">expand_more</i>Expand</a></h5><div class="collapse" id="' +
                device + '_changelog"><p id="changelog_text">' +
                item.changelog.replace(/\*\*\:/g, ':</b>').replace(/\*\*/g, '<b>').replace(/\n/g, '<br>') +
                '</p></div></li></ul></div>'
        });
        $('#downloads').html(downloads_html);
    }
}

// Load archive downloads
function loadArchive(device) {
    $(document).ready(function () {
        var downloads = new Array();
        var devices = new Array();
        fetchData();
        function updateDownloads(data) {
            Object.entries(data).forEach(function (item) {
                Object.entries(item[1]).forEach(function ([key, value]) {
                    var codename = key;
                    var name = devices[codename];
                    if (codename == device || device == "") {
                        Object.entries(value).forEach(function ([rom, link]) {
                            var version = rom;
                            var download = link;
                            downloads.push({
                                'name': name, 'codename': codename,
                                'version': version, 'download': download
                            })
                        })
                    }
                })
            });
        }
        function fetchData() {
            var url = 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/';
            $.when(
                $.ajax({
                    url: url + 'devices.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'archive/archive.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                })).done(function (names, archive) {
                    devices = names[0];
                    updateDownloads(archive[0]);
                    DrawTable(downloads);
                })
        }
        function DrawTable(downloads) {
            $('#downloads').DataTable({
                data: downloads,
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[2, "desc"]],
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
                    { data: 'codename', className: "min-mobile-l" },
                    { data: 'version', className: "all" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    }
                ]
            });
        };
    })
};

// Open link in new tab
function openInTab(url) {
    var download = window.open(url, '_blank');
    // https://stackoverflow.com/a/19851803
    if (download) {
        // Browser has allowed it to be opened
        download.focus();
    } else {
        // Browser has blocked it
        alert('Please allow popups for this website in order to open download links!');
    }
}

// open external links in new tab
// https://stackoverflow.com/a/4425214
$(document.links).filter(function () {
    return this.hostname != window.location.hostname;
}).attr('target', '_blank')
