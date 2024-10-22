/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9545454545454546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "SignUp"], "isController": false}, {"data": [1.0, 500, 1500, "signon-0"], "isController": false}, {"data": [1.0, 500, 1500, "signon"], "isController": false}, {"data": [1.0, 500, 1500, "signoff-0"], "isController": false}, {"data": [1.0, 500, 1500, "signon-1"], "isController": false}, {"data": [1.0, 500, 1500, "signoff"], "isController": false}, {"data": [1.0, 500, 1500, "signoff-1"], "isController": false}, {"data": [1.0, 500, 1500, "newAccount"], "isController": false}, {"data": [0.5, 500, 1500, "Launch"], "isController": false}, {"data": [1.0, 500, 1500, "newAccount-1"], "isController": false}, {"data": [1.0, 500, 1500, "newAccount-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 99, 0, 0.0, 263.8989898989899, 163, 827, 185.0, 392.0, 528.0, 827.0, 17.432646592709986, 92.62297224423314, 14.544745443740094], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SignUp", 9, 0, 0.0, 193.0, 174, 280, 180.0, 280.0, 280.0, 280.0, 5.353955978584176, 36.877579379833435, 3.0063717653182627], "isController": false}, {"data": ["signon-0", 9, 0, 0.0, 174.99999999999997, 163, 187, 176.0, 187.0, 187.0, 187.0, 5.244755244755245, 4.527698863636363, 3.7543023382867133], "isController": false}, {"data": ["signon", 9, 0, 0.0, 353.55555555555554, 327, 375, 354.0, 375.0, 375.0, 375.0, 4.7518479408658925, 35.98431725184794, 6.4688242476240765], "isController": false}, {"data": ["signoff-0", 9, 0, 0.0, 171.66666666666666, 163, 183, 170.0, 183.0, 183.0, 183.0, 5.190311418685121, 3.9850958765859286, 2.879000865051903], "isController": false}, {"data": ["signon-1", 9, 0, 0.0, 178.22222222222223, 163, 189, 178.0, 189.0, 189.0, 189.0, 5.202312138728324, 34.90448880057804, 3.358133128612717], "isController": false}, {"data": ["signoff", 9, 0, 0.0, 354.55555555555554, 329, 380, 356.0, 380.0, 380.0, 380.0, 4.704652378463147, 35.10213832984841, 5.15030792603241], "isController": false}, {"data": ["signoff-1", 9, 0, 0.0, 182.55555555555554, 166, 207, 179.0, 207.0, 207.0, 207.0, 5.142857142857142, 34.42299107142857, 2.77734375], "isController": false}, {"data": ["newAccount", 9, 0, 0.0, 360.6666666666667, 339, 392, 362.0, 392.0, 392.0, 392.0, 4.805125467164976, 35.555634343299516, 7.719171282701549], "isController": false}, {"data": ["Launch", 9, 0, 0.0, 573.3333333333333, 503, 827, 528.0, 827.0, 827.0, 827.0, 4.105839416058394, 27.469829921304743, 2.016833228786496], "isController": false}, {"data": ["newAccount-1", 9, 0, 0.0, 180.66666666666666, 166, 207, 178.0, 207.0, 207.0, 207.0, 5.30035335689046, 34.97738607921084, 3.602583922261484], "isController": false}, {"data": ["newAccount-0", 9, 0, 0.0, 179.66666666666666, 170, 191, 180.0, 191.0, 191.0, 191.0, 5.35077288941736, 4.283056814803805, 4.958870578180737], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 99, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
