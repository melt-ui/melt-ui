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

### Layout

The Charts API allows you to optionally specify `margin` and `padding` either as a single value, which applies uniformly to all four sides (top, right, bottom, left), or as individual values for each side for more precise control.

`margin` and `padding` are combined with `width` and `height` to create `area`.
`area` provides easy access to all the calculations likely to be needed when laying out a chart.

<Preview code={snippets.layout}> 
  <svelte:component this={previews.layout} /> 
</Preview>

#### Usage

<div class="grid grid-cols-[4em_1fr] gap-2 mt-1 mb-4">
	<div class="bg-emerald-300 row-span-2"></div>
	<div>Chart Content (<code>.padding.inner</code>)</div>
    <div class="italic">Used for displaying visuals such as graphs</div>
	<div class="bg-indigo-200 row-span-2"></div>
	<div>Padding (<code>.padding.outer</code>...<code>padding.inner</code>)</div>
    <div class="italic">Usually left blank</div>
	<div class="bg-fuchsia-200 row-span-2"></div>
	<div>Margin (<code>.margin.outer</code>...<code>margin.inner</code>/<code>.padding.outer</code>)</div>
    <div class="italic">Usually used for placing axes</div>
</div>

| Properties of `$area` | Relation                                                                                        |
|-----------------------|-------------------------------------------------------------------------------------------------| 
| `.width`, `.height`   | Chart size, including margins and padding                                                       |
| `.margin`             | Calculated margin values                                                                        |
| `.margin.outer`       | The area outside the margins / The entire chart area                                            |
| `.margin.inner`       | The area inside the margins / The chart area, shrunk by the specified margins                   |
| `.padding`            | Calculated padding values                                                                       |
| `.padding.outer`      | The area outside the padding. Same as `.margin.inner`                                           |
| `.padding.inner`      | The area inside the padding / The chart area shrunk by the specified margins and padding values |

```ts
interface Area extends Size {   
	padding: Sides & Size & {    
      inner: Sides & Size;    
      outer: Sides & Size;   
	};  
	margin: Sides & Size & {    
      inner: Sides & Size;    
      outer: Sides & Size;  
	};
}

interface Sides {   
  top: number;   
  left: number;
  bottom: number;   
  right: number;
}

interface Size {   
  width: number;
  height: number;
}
```

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