import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.createSVG();
    d3.json('https://api.apify.com/v2/key-value-stores/fabbocwKrtxSDf96h/records/LATEST?disableRedirect=true').then(data => this.drawBars(data['infectedByRegion']));
  }

  private createSVG(): void {
      this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
       // Create the X-axis band scale
      const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.region))
      .padding(0.5);

    // Draw the X-axis on the DOM
      this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 700000])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.region))
      .attr("y", d => y(d.infectedCount))
      .attr("width", x.bandwidth())
      .attr("height", (d) => this.height - y(d.infectedCount))
      .attr("fill", "#d04a35");
  }

}
