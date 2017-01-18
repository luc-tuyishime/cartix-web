function leafletCartix() {
    var windowHeight = ($(window).height());
    var width = ($(window).width());

    $("#map").css("height", windowHeight);
    $("#map").css("width", width * 0.75);



    $("#sel").css("right", width * 0.26);

    var geojson;
    var map = L.map('map', {
        zoomControl: true
    }).setView([-2.0334, 29.8993], 9);
    map.zoomControl.setPosition('topright');
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; ' + mapLink,
        maxZoom: 13,
        minZoom: 9
    }).addTo(map);




    function getColor(d) {
        return d > 5001 ? '#7f2704' :
            d > 4001 ? '#a63603' :
            d > 3001 ? '#d94801' :
            d > 0 ? '#f16913' :
            '#fd8d3c';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '1',
            fillOpacity: 10
        };
    }

    function Display(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
        }
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
        map.setView([-2.0334, 29.8993], 9);
    }

    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 3
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.getJSON('stats.json', function(data) {
            $.each(data.Provinces, function(key, obj) {
                if (obj.Province == layer.feature.properties.Name) {
                    var mm = obj.Membership;
                    var f = obj.Female;
                    var ml = obj.Male;
                    info.update(layer.feature.properties, mm, f, ml);
                }
            });

        });

    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    //custom control within the map
    var info = L.control({
        position: 'topleft'
    });
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function(props, membr, fem, male) {

        this._div.innerHTML = '<h4>Saving groups per Province</h4>' + (props ?
            '<b>' + props.Name + ' Province</b><br />' + props.density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br>' :
            'Hover over a province');

    };
    //legend
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 3001, 4001, 5001],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    function getColorP(d) {
        return d > 2001 ? '#7f2704' :
            d > 1501 ? '#a63603' :
            d > 1001 ? '#d94801' :
            d > 501 ? '#f16913' :
            d > 0 ? '#fd8d3c' :
            '#fff5eb';
    }

    function styleP(feature) {
        return {
            fillColor: getColorP(feature.properties.density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }

    function provinceDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureP
                }).addTo(map);
            });
        }
    }

    function onEachFeatureP(feature, layer) {
        layer.on({
            mouseover: highlightFeatureP,
            mouseout: resetHighlightP
        });
        map.setView([-2.0334, 29.8993], 9);
    }

    function kigaliProDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleP,
                    onEachFeature: onEachFeatureKP
                }).addTo(map);
            });
        }
    }

    function onEachFeatureKP(feature, layer) {
        layer.on({
            mouseover: highlightFeatureP,
            mouseout: resetHighlightP
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 10
        });
    }

    function highlightFeatureP(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 3
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.getJSON('stats.json', function(data) {
            $.each(data.Districts, function(key, obj) {
                if (obj.District == layer.feature.properties.Name) {
                    var mm1 = obj.Membership;
                    var f1 = obj.Female;
                    var ml1 = obj.Male;
                    console.log(mm1);
                    infoP.update(layer.feature.properties, mm1, f1, ml1);
                }
            });

        });

    }

    function resetHighlightP(e) {
        geojson.resetStyle(e.target);
        infoP.update();
    }
    //custom control within the map
    var infoP = L.control({
        position: 'topleft'
    });
    infoP.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoP.update = function(props, membr, fem, male) {
        this._div.innerHTML = '<h4>Saving groups in each District per Province</h4>' + (props ?
            '<b>' + props.Name + ' Province</b><br />' + props.density + ' Saving groups<br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br>' :
            'Hover over a province');

    };
    //legend
    var legendP = L.control({
        position: 'bottomright'
    });
    legendP.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 501, 1001, 1501, 2001],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorP(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    function getColorD(d) {
        return d > 2001 ? '#8c2d04' :
            d > 1001 ? '#d94801' :
            d > 801 ? '#f16913' :
            d > 601 ? '#fd8d3c' :
            d > 401 ? '#fdae6b' :
            d > 201 ? '#fdd0a2' :
            d > 0 ? '#fee6ce' :
            '#fff5eb';
    }

    function styleD(feature) {
        return {
            fillColor: getColorD(feature.properties.density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }

    function districtDisplay(geofile) {
        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleD,
                    onEachFeature: onEachFeatureD
                }).addTo(map);
            });
        }
    }

    function onEachFeatureD(feature, layer) {
        layer.on({
            mouseover: highlightFeatureD,
            mouseout: resetHighlightD
        });
        map.setView([-2.0334, 29.8993], 9);
    }


    function highlightFeatureD(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 3
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.getJSON('stats.json', function(data) {
            $.each(data.Districts, function(key, obj) {
                if (obj.District == layer.feature.properties.Name) {

                    var mm = obj.Membership;
                    var f = obj.Female;
                    var ml = obj.Male;

                    infoD.update(layer.feature.properties, mm, f, ml);
                }
            });

        });

    }

    function resetHighlightD(e) {
        geojson.resetStyle(e.target);
        infoD.update();
    }

    //custom control within the map
    var infoD = L.control({
        position: 'topleft'
    });

    infoD.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoD.update = function(props, membr, fem, male) {
        this._div.innerHTML = '<h4>Saving groups per District</h4>' + (props ?
            '<b>' + props.Name + ' District</b><br />' + props.density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br>' :
            'Hover over a district');
    };
    //legend
    var legendD = L.control({
        position: 'bottomright'
    });
    legendD.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 201, 401, 601, 801, 1001, 2001, ],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorD(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    function getColorS(d) {
        return d > 141 ? '#7f2704' :
            d > 121 ? '#a63603' :
            d > 101 ? '#d94801' :
            d > 81 ? '#f16913' :
            d > 61 ? '#fd8d3c' :
            d > 41 ? '#fdae6b' :
            d > 21 ? '#fdd0a2' :
            d > 0 ? '#fee6ce' :
            '#fff5eb';
    }

    function styleS(feature) {
        return {
            fillColor: getColorS(feature.properties.density),
            weight: 2,
            opacity: 10,
            color: 'white',
            dashArray: '3',
            fillOpacity: 10
        };
    }

    function sectorDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureS
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeatureS
                }).addTo(map);
            });
        }

    }

    function kigaliDisplay(geofile) {

        if (geojson === undefined) {
            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
            });
        } else {
            geojson.eachLayer(function(layer) {
                map.removeLayer(layer);
                map.removeControl(infoD);
                map.removeControl(legendD);
                map.removeControl(infoS);
                map.removeControl(legendS);
                map.removeControl(info);
                map.removeControl(legend);
                map.removeControl(infoP);
                map.removeControl(legendP);
            });

            $.getJSON(geofile, function(rwandaData) {
                geojson = L.geoJson(rwandaData, {
                    style: styleS,
                    onEachFeature: onEachFeaturekigali
                }).addTo(map);
            });
        }

    }

    function onEachFeaturekigali(feature, layer) {
        layer.on({
            mouseover: highlightFeatureS,
            mouseout: resetHighlightS
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 11
        });

    }

    function onEachFeatureS(feature, layer) {
        layer.on({
            mouseover: highlightFeatureS,
            mouseout: resetHighlightS
        });
        var bounds = layer.getBounds();
        map.fitBounds(bounds, {
            maxZoom: 10
        });

    }

    function highlightFeatureS(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 3
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        $.getJSON('stats.json', function(data) {
            $.each(data.Sectors, function(key, obj) {
                if (obj.District == layer.feature.properties.District) {
                    if (obj.Sector == layer.feature.properties.Name) {
                        var mm = obj.Membership;
                        var f = obj.Female;
                        var ml = obj.Male;

                        infoS.update(layer.feature.properties, mm, f, ml);
                    }
                }
            });

        });

    }

    function resetHighlightS(e) {
        geojson.resetStyle(e.target);
        infoS.update();
    }


    //custom control within the map
    var infoS = L.control({
        position: 'topleft'
    });

    infoS.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    infoS.update = function(props, membr, fem, male) {
        this._div.innerHTML = '<h4>Saving groups per Sector</h4>' + (props ?
            '<b>' + props.Name + ' Sector</b><br />' + props.density + ' Saving groups <br/> <b> Total Membership: </b>' + membr + '<br/> <b> Total Female: </b>' + fem + ' <br/> <b>Total Male: </b>' + male + '</br>' :
            'Hover over a Sector');
    };
    //legend
    var legendS = L.control({
        position: 'bottomright'
    });

    legendS.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 21, 41, 61, 81, 101, 121, 141],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorS(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };


    function handler1() {
        document.getElementById('ge').value = "";
        document.getElementById('geo').value = "";
        if (document.getElementById('pro')) {
            switch (document.getElementById('pro').value) {
                case "eastern":
                    provinceDisplay("Eastern_Province.geojson");
                    break;
                case "western":
                    provinceDisplay("Western_Province.geojson");
                    break;
                case "kigali-city":
                    kigaliProDisplay("Kigali_geojson.geojson");
                    break;
                case "northen":
                    provinceDisplay("Northern_Province.geojson");
                    break;
                case "southern":
                    provinceDisplay("Southern_Province.geojson");
                    break;
            }
            legendP.addTo(map);
            infoP.addTo(map);

        }
    }

    function handler() {
        document.getElementById('pro').value = "";
        document.getElementById('ge').value = "";

        if (document.getElementById('geo')) {
            switch (document.getElementById('geo').value) {
                case "provinces":
                    Display("admin4.geojson");
                    legend.addTo(map);
                    info.addTo(map);
                    break;
                case "districts":
                    districtDisplay("District_Rwanda.geojson");
                    legendD.addTo(map);
                    infoD.addTo(map);
                    break;
                case "sectors":
                    sectorDisplay("Sector_Rwanda.geojson");
                    legendS.addTo(map);
                    infoS.addTo(map);
                    break;
            }

        }
    }

    function handler2() {
        document.getElementById('pro').value = "";
        document.getElementById('geo').value = "";

        if (document.getElementById('ge')) {
            switch (document.getElementById('ge').value) {
                case "gasabo":
                    kigaliDisplay("districts/Gasabo.geojson");

                    break;
                case "kicukiro":
                    kigaliDisplay("districts/Kicukiro.geojson");
                    break;
                case "nyarugenge":
                    kigaliDisplay("districts/Nyarugenge.geojson");
                    break;
                case "burera":
                    sectorDisplay("districts/Burera.geojson");
                    break;
                case "gakenke":
                    sectorDisplay("districts/Gakenke.geojson");
                    break;
                case "gicumbi":
                    sectorDisplay("districts/Gicumbi.geojson");
                    break;
                case "musanze":
                    sectorDisplay("districts/Musanze.geojson");
                    break;
                case "rulindo":
                    sectorDisplay("districts/Rulindo.geojson");
                    break;
                case "gisagara":
                    sectorDisplay("districts/Gisagara.geojson");
                    break;
                case "huye":
                    sectorDisplay("districts/Huye.geojson");
                    break;
                case "kamonyi":
                    sectorDisplay("districts/Kamonyi.geojson");
                    break;
                case "muhanga":
                    sectorDisplay("districts/Muhanga.geojson");
                    break;
                case "nyamagabe":
                    sectorDisplay("districts/Nyamagabe.geojson");
                    break;
                case "nyanza":
                    sectorDisplay("districts/Nyanza.geojson");
                    break;
                case "nyaruguru":
                    sectorDisplay("districts/Nyaruguru.geojson");
                    break;
                case "ruhango":
                    sectorDisplay("districts/Ruhango.geojson");
                    break;
                case "karongi":
                    sectorDisplay("districts/Karongi.geojson");
                    break;
                case "ngororero":
                    sectorDisplay("districts/Ngororero.geojson");
                    break;
                case "nyabihu":
                    sectorDisplay("districts/Nyabihu.geojson");
                    break;
                case "nyamasheke":
                    sectorDisplay("districts/Nyamasheke.geojson");
                    break;
                case "rubavu":
                    sectorDisplay("districts/Rubavu.geojson");
                    break;
                case "rusizi":
                    sectorDisplay("districts/Rusizi.geojson");
                    break;
                case "rutsiro":
                    sectorDisplay("districts/Rutsiro.geojson");
                    break;
                case "bugesera":
                    sectorDisplay("districts/Bugesera.geojson");
                    break;
                case "gatsibo":
                    sectorDisplay("districts/Gatsibo.geojson");
                    break;
                case "kayonza":
                    sectorDisplay("districts/Kayonza.geojson");
                    break;
                case "kirehe":
                    sectorDisplay("districts/Kirehe.geojson");
                    break;
                case "ngoma":
                    sectorDisplay("districts/Ngoma.geojson");
                    break;
                case "nyagatare":
                    sectorDisplay("districts/Nyagatare.geojson");
                    break;
                case "rwamagana":
                    sectorDisplay("districts/Rwamagana.geojson");
                    break;
            }

            legendS.addTo(map);
            infoS.addTo(map);

        }

    }
}