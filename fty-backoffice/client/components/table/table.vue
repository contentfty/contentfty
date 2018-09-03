<template>
  <!--<card :class-name="className">-->
  <card :class-name="classes">
    <div class="table__wrapper-shadow">
      <div class="table__wrapper">
        <table>
          <thead>
            <slot name="header"/>
          </thead>
          <tbody>
            <slot/>
          </tbody>
        </table>
      </div>
    </div>
  </card>
</template>
<script>
  import {Card} from '~/components/card'

  export default {
    name: 'Table',
    components: {Card},
    props: {
      compact: {
        type: Boolean,
        default: false
      },
      horizontalScroll: {
        type: Boolean,
        default: false
      },
      className: {
        type: String
      }
    },
    computed: {
      classes () {
        return [
          'table',
          {
            'is-compact-table': this.compact,
            'is-horizontally-scrollable': this.horizontalScroll
          },
          this.className
        ]
      }
    }
  }
</script>
