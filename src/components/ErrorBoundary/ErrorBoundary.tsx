import React, { Component, ReactNode } from "react";
import ErrorFallbackUi from "./ErrorFallbackUi";

import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { submitErrorLog } from "../../api";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ReduxProps {
  userId: number;
  liveClassId: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true });

    console.log("error", error);
    console.log("errorInfo", errorInfo);

    const { userId, liveClassId } = this.props;

    let errors = error?.stack.split("\n", 2).join("");

    submitErrorLog(userId, liveClassId, errors, 0, 0);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallbackUi />;
    }

    return this.props.children;
  }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
  userId: state.liveClassDetails.userId,
  liveClassId: state.liveClassDetails.liveClassId,
});

export default connect(mapStateToProps)(ErrorBoundary);
