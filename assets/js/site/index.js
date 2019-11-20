function scrollToDownload() {
    if ($('.section-downloads').length != 0) {
        $("html, body").animate({
            scrollTop: $('.section-downloads').offset().top
        }, 1000);
    }
}

function navigate(url) {
    window.location.href = url;
}

// Load devices
var devicesList = [];
$(document).ready(function () {
    $.when(
        $.ajax({
            url: 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/devices.yml',
            async: true,
            converters: {
                'text yaml': function (result) {
                    return jsyaml.load(result);
                }
            },
            dataType: 'yaml'
        })
    ).done(function (devices) {
        Object.entries(devices).forEach(function ([codename, name]) {
            devicesList.push({ text: name + ' (' + codename + ')', id: codename });
        }),
            $(".device").select2({
                placeholder: "- Device -",
                data: devicesList
            })
    })
})

// Load regions
var regionsList = [];
$(document).ready(function () {
    $.when(
        $.ajax({
            url: 'https://raw.githubusercontent.com/androidtrackers/realme-updates-tracker/master/regions.yml',
            async: true,
            converters: {
                'text yaml': function (result) {
                    return jsyaml.load(result);
                }
            },
            dataType: 'yaml'
        })
    ).done(function (regions) {
        Array.from(regions).forEach(function (item) {
            regionsList.push({ text: item, id: item });
        }),
            $(".region").select2({
                placeholder: "- Region -",
                data: regionsList
            })
    })
})

// Process to download page
function choicesParser() {
    var devicesForm = document.getElementById("DownloadForm").elements;
    if (devicesForm.device.value) {
        var type = devicesForm.choose.value;
        var device = devicesForm.device.value;
        if (device != '') {
            if (type == 'archive') {
                window.location.href = window.location.origin + "/downloads/archive/" + device;
            }
            else {
                window.location.href = window.location.origin + "/downloads/latest/" + device;
            }
        }
        else {
            $('#NoDeviceError').modal('toggle');
        };
        return false;
    } else {
        var regionsForm = document.getElementById("RegionForm").elements;
        var region = regionsForm.region.value;
        if (region != '') {
            window.location.href = window.location.origin + "/downloads/latest/" + region;
        }
        else {
            $('#NoDeviceError').modal('toggle');
        };
        return false;
    }
};
