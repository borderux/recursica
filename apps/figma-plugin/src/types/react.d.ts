import React from 'react';

// Ensure React types are available globally
declare global {
  namespace JSX {
    interface Element extends React.ReactElement {}
    interface IntrinsicElements extends React.ReactHTML {}
  }
}
