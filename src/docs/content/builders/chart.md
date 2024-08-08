---
title: Chart
description: A control that displays a d3 chart
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
    export let snippets
    export let previews
</script>

## Anatomy

- **Root**: The root container for the chart

## Usage

To create a chart, use the `createChart` builder function. Follow the anatomy or the example
above to create your chart.

## Glossary

- **Get / Get_Sub**: A key/function or record of key/functions used to extract the domain data for a given row
- **Discrete**: Discrete data consists of separate and distinct values (like categories), while continuous data is unbroken and can take any value within a range (like temperature or time)
- **Extent**: The range of values present in the given data for the given domain 
- **Domain**: The range of values to display for the given domain 
- **Range**: The range of values which the domain is mapped to  
- **Scale**: The mapping function/instance used for mapping a domain onto a range

In the example above, we have the following:
    
* x dimension:
    * Get: `'year'`
    * Discrete: `true`
    * Extent: `Set(['2016', '2017', '2018', '2019'])`
    * Domain: `Set(['2016', '2017', '2018', '2019'])`
    * Range: `width - margin - padding`
    * Scale: [`d3 scaleBand`](https://d3js.org/d3-scale/band)
* y dimension:
    * Get: `'apples'`
    * Discrete: `false`
    * Extent: `[820, 3840]`
    * Domain: `[0, 3840]`
    * Range: `height - margin - padding`
    * Scale: [`d3 scaleLinear`](https://d3js.org/d3-scale/linear)

## Examples

### Multiple

Dimensions can be specified as a collection of sub dimensions, allowing all sub dimensions in the range to share extents, domain, range and scale properties.

This is useful when combining multiple graphs into one chart.

<Preview code={snippets.multi}> 
  <svelte:component this={previews.multi} /> 
</Preview>

### Composite

Multiple charts can be combined into composite charts. 

<Preview code={snippets.composite}> 
  <svelte:component this={previews.composite} /> 
</Preview>

## API Reference

<APIReference {schemas} />