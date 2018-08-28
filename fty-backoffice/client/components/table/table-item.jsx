export default {
  props: {
    alignRight: Boolean,
    className: String,
    isHeader: Boolean,
    isRowHeader: Boolean,
    isTitle: Boolean,
  },
  methods: {
    getScope (isHeader, isRowHeader) {
      if (isHeader) {
        return 'col'
      }
      if (isRowHeader) {
        return 'row'
      }
      return null
    }
  },
  computed: {
    classes() {
      return [
        {
          'table-heading': this.isHeader,
          'table-item': !this.isHeader,
          'is-title-cell': this.isTitle,
          'is-row-heading': this.isRowHeader,
          'is-align-right': this.alignRight,
        }
      ]
    }
  },
  render (h) {
    const isHeading = this.isHeader || this.isRowHeader;
    const Cell = isHeading ? 'th' : 'td';

    return (
      <Cell class={this.classes} scope={this.getScope(this.isHeader, this.isRowHeader)}>
        {this.isTitle ? <div class="table-item__cell-title">{this.$slots.default}</div> : this.$slots.default}
      </Cell>
    )
  }
}
