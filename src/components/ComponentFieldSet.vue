<template>
  <fieldset class="components-field-set">
    <slot name="legend">
      <legend class="title">{{ title }}</legend>
    </slot>
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  name: "ComponentFieldSet",
  props: ["title"]
}
</script>

<style scoped>
.components-field-set {
  min-width: inherit;
  color: black;
  border: 1px solid white;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  margin: 0 0 10px 0;
}

.components-field-set .title {
  font-size: 14px;
  padding: 10px 0 10px 0;
}
</style>
