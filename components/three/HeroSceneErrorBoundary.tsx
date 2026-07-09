"use client";

import { Component, type ReactNode } from "react";
import { HeroSceneFallback } from "@/components/three/HeroSceneFallback";

type HeroSceneErrorBoundaryProps = {
  children: ReactNode;
};

type HeroSceneErrorBoundaryState = {
  failed: boolean;
};

export class HeroSceneErrorBoundary extends Component<
  HeroSceneErrorBoundaryProps,
  HeroSceneErrorBoundaryState
> {
  state: HeroSceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): HeroSceneErrorBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <HeroSceneFallback />;
    }

    return this.props.children;
  }
}
