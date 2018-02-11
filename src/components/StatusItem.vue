<script>
export default {
  props: ['status', 'text', 'instructions']
}
</script>

<template>
  <div class="status">
    <button v-if="status === null" class="button is-text is-loading is-small" disabled />
    <span v-else-if="status" class="tag is-success">Success</span>
    <span v-else class="tag is-danger">Error</span>

    <span v-if="status === null || status">{{ text }}</span>
    <span v-else>{{ instructions }}</span>
  </div>
</template>
