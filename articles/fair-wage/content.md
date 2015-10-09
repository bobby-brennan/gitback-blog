<style>
  path { 
      stroke: steelblue;
      stroke-width: 2;
      fill: none;
  }
  .key {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-left: 40px;
  }
  .govt {
    stroke: #D91E18;
    background-color: #D91E18;
  }
  .wage {
    stroke: #26A65B;
    background-color: #26A65B;
  }
  .axis path,
  .axis line {
      fill: none;
      stroke: grey;
      stroke-width: 1;
      shape-rendering: crispEdges;
  }
  .graph {
    font-weight: 200;
  }
  .graph .title {
    font-weight: 800;
  }
</style>
<script>
  var margin = {top: 30, right: 20, bottom: 80, left: 80},
      width = 450 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
  var x = d3.scale.linear().range([width, 0]);
  var y = d3.scale.linear().range([height, 0]);
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);
  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);
  var addDollarSign = function(d) {return '$' + d};
  xAxis.tickFormat(addDollarSign);
  yAxis.tickFormat(addDollarSign);

  var MAX_BASE = 30;
  var MAX_NET = 30;
  var baseWages = [];
  for (i = 0; i <= MAX_BASE; ++i) baseWages.push(i);
  x.domain([MAX_BASE, 0]);
  y.domain([0, MAX_NET]);

  var Graphs = {};
  Graphs.Half = {
    title: "Supplementing half way to $15",
    graph: function(base) {
      return Math.max(0, (15 - base) / 2) + base;
    }
  }
  Graphs.Full = {
    title: "Supplementing all the way to $7.50",
    graph: function(base) {
      return Math.max(7.5, base);
    }
  }
  Graphs.Third = {
    title: "Supplementing one-third of the way to $22.50",
    graph: function(base) {
      return Math.max(0, (22.5 - base) / 3) + base;
    }
  }

  function initGraphs() {
    for (graph in Graphs) initGraph(graph);
  }

  function initGraph(name) {
    var valueline = d3.svg.line()
      .x(function(d) { return x(d); })
      .y(function(d) { return y(Graphs[name].graph(d)); });
    var govtContrib = d3.svg.line()
      .x(function(d) { return x(d) })
      .y(function(d) { return y(Graphs[name].graph(d) - d) })

    var svg = d3.select("#" + name)
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .attr("class", "wage")
        .attr("d", valueline(baseWages));

    svg.append("path")
        .attr("class", "govt")
        .attr("d", govtContrib(baseWages));

    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text(Graphs[name].title)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("x", width / 2)
        .attr("y",  height + 50)
        .style("text-anchor", "middle")
        .text("Employer Contribution");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    /*
    svg.append("text")
        .attr("x",  -height / 2)
        .attr("y", 30 - margin.left)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Net Wage");
    */
  }
</script>

## Overview
The idea that workers should be guaranteed enough income to fulfill their basic needs
is nothing new. After my home state of Massachusetts began exploring recommended
(non-compulsory) minimum wages in 1912, other states followed suit, with over a dozen
adopting minimum wage laws by the early 1920s [1].

But the push for mandated minimum wages was not without controversy. The first attempt
to establish a national miniumum wage in the U.S. was ruled unconstitutional in 1935 [2].
Critics claim that rather than boosting incomes, minimum wage laws suppress employment,
ironically hurting the very people they aim to help.

One solution is to simply do away with the miniumum wage, and have the government
supplement unacceptably low wages. This would allow us not only to ensure that
every worker earns a living wage; it would also alleviate unemployment among low-wage
workers.

Of course, we must consider the cost to taxpayers, as well as the possible distortions
such a policy could create in the labor market. However, as I explain below, the cost
would be greatly offset by the reduced need for social welfare programs
like unemployment benefits and EITC, and a well-designed, gradual implementation
would distort the labor market far less than a mandated floor on wages.

## Implementation Details
The main concern with the government subsidising wages up to a particular amount is
that it removes the incentive for workers to seek out higher wages. If the government
guarantees an income of $10/hour, employees will happily accept wages of $0/hour
knowing that the rest will come from the government.

To alleviate this concern, I propose that the government promise to supplement wages
**half way** to a given amount, say $15/hour. So if an employee is hired at $5/hour,
the government will chip in an extra $5, bringing their wage to a total of $10/hour.
An employer could even hire someone at $0/hour (still covering administrative and
training costs), and the government would bump this up to $7.50.

Under this system, employees are still incentivized to seek out higher wages - for every
$1/hour more they get from their employer, they'll see an extra $0.50 on their paycheck,
and the government will chip in $0.50 less. Of course, we're still reducing the incentive
to seek out higher pay, but we've also created a lever we can play with; by changing the
fraction to, say, one-third of the way to $15/hour, the employee sees an additional $0.66 for
every extra dollar they earn. We can even create more complex functions, so that the
lowest-paid workers have the strongest incentives to seek out higher pay.

### Graphs
The following graphs show the effects of different subsidised-wage policies on net
wages earned. Each policy guarantees a minimum wage of $7.50/hour. The green line
represents the amount employees take home after the government subsidy is added, and
its slope represents the marginal utility of getting a raise.

For the simplest case, where the government tops up everyone's paycheck to $7.50 an hour,
the slope is initially flat, meaning that a $1 raise from the employer adds nothing
to the employee's take-home.

Each graph has an inflection point where the government subsidy ends, and the slope of
the green line becomes 1 - meaning that every extra $1 earned results in $1 of take-home
pay.

<br><br>
<div class="key wage"></div> Net Wages
<div class="key govt"></div> Government Contribution
<br><br>
<div class="graph" id="Full"></div>
<div class="graph" id="Half"></div>
<div class="graph" id="Third"></div>

## Benefits
* Full employment
* Employment for the unemployable (elderly, disabled)
* Reduced crime
* New enterprises that exploit cheap labor

## Costs

### Current Programs
* Unemployment benefits
* Welfare and work-for-welfare
The [Earned Income Tax Credit](https://en.wikipedia.org/wiki/Earned_income_tax_credit)
currently distributes over $50 billion anually, making it one of the largest
social welfare programs in U.S. history (though still an order of magnitude
smaller than Social Security and Medicare/Medicaid) [3]. However, it does nothing to
help the unemployed, and an annual 

## Implementation
* Subsidize half way to some number
* Employers front cost
* Govt reimburses via tax credit
* Employees see full net wage on paycheck, are essentially hired for net wage

### Gradual Rollout
* Gradually reduce min wage and increase subsidy
* State-by-state

## Conclusion
Government-subsidised wages present an opportunity to lift the quality of life
for millions of our most vulnerable citizens, as well as boost employment and
productivity. The idea should excite everyone from socialists to free-market
fundamentalists.

## Citations
[1], [2] https://en.wikipedia.org/wiki/Minimum_wage_in_the_United_States#History

[3] https://en.wikipedia.org/wiki/Earned_income_tax_credit#Cost

http://www.manhattan-institute.org/pdf/ib_37.pdf

<script>
  initGraphs();
</script>
