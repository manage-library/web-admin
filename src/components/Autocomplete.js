import React from 'react'
import Autocomplete from 'react-autocomplete'
import PropTypes from 'prop-types'

const AutocompleteComponent = ({
  items = [],
  searchKey,
  setSearchKey,
  label,
  onSelect,
  disable = false,
  defaultValue,
}) => {
  return (
    <Autocomplete
      getItemValue={(item) => item[label]}
      items={items}
      shouldItemRender={(item, value) =>
        item[label].toLowerCase().indexOf(value.toLowerCase()) > -1
      }
      renderItem={(item, isHighlighted) => (
        <div
          key={item.id}
          style={{
            background: isHighlighted ? 'lightgray' : 'white',
            padding: '8px 10px',
          }}
        >
          {item[label]}
        </div>
      )}
      renderInput={function (props) {
        return <input {...props} className="datePicker" />
      }}
      wrapperStyle={{
        display: 'block',
      }}
      menuStyle={{
        borderRadius: '3px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2px 0',
        fontSize: '90%',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        zIndex: '9999',
      }}
      value={defaultValue || searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      onSelect={(val) => {
        setSearchKey(val)
        onSelect(items.find((item) => item[label] === val))
      }}
      inputProps={{
        disabled: disable,
      }}
    />
  )
}

AutocompleteComponent.propTypes = {
  searchKey: PropTypes.string,
  setSearchKey: PropTypes.func,
  items: PropTypes.array,
  label: PropTypes.string,
  onSelect: PropTypes.func,
  disable: PropTypes.bool,
  defaultValue: PropTypes.string,
}

export default AutocompleteComponent
