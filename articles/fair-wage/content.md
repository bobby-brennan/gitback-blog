<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js">
</script>
<script>
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
var x = d3.scale.linear().range([width, 0]);
var y = d3.scale.linear().range([height, 0]);
x.domain([0, 20]);
y.domain([0, 20]);
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
var baseWages = [];
for (i = 0; i <= 15; ++i) baseWages.push(i);
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

#### Graphs
<div id="Fifteen"></div>
<script>
var valueline = d3.svg.line()
  .x(function(d) { return x(d); })
  .y(function(d) { return y((15 - d)/2 + d); });
var svg = d3.select("#Fifteen")
  .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
</script>

someone at $0 and hour, and 
(15 - emp) / 2 = govt

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
