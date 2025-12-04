-- Sponsorship Feature Migration
-- This adds tables to support community sponsorship/donations for issues

-- Create sponsorships table
CREATE TABLE public.sponsorships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount BIGINT NOT NULL, -- Amount in minor units (cents/kobo)
  currency VARCHAR(3) DEFAULT 'SLE' NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider VARCHAR(50) DEFAULT 'monime',
  payment_reference VARCHAR(255),
  transaction_id VARCHAR(255), -- Monime transaction ID
  is_anonymous BOOLEAN DEFAULT true,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create issue funding goals table
CREATE TABLE public.issue_funding (
  issue_id UUID PRIMARY KEY REFERENCES public.issues(id) ON DELETE CASCADE,
  goal_amount BIGINT, -- Optional funding goal in minor units
  current_amount BIGINT DEFAULT 0 NOT NULL,
  currency VARCHAR(3) DEFAULT 'SLE' NOT NULL,
  sponsor_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_sponsorships_issue_id ON public.sponsorships(issue_id);
CREATE INDEX idx_sponsorships_user_id ON public.sponsorships(user_id);
CREATE INDEX idx_sponsorships_status ON public.sponsorships(payment_status);
CREATE INDEX idx_sponsorships_created_at ON public.sponsorships(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_funding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsorships
-- Everyone can view completed sponsorships (respecting anonymity in app logic)
CREATE POLICY "Completed sponsorships are viewable by everyone."
  ON sponsorships FOR SELECT
  USING (payment_status = 'completed');

-- Users can view their own sponsorships regardless of status
CREATE POLICY "Users can view their own sponsorships."
  ON sponsorships FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create sponsorships
CREATE POLICY "Authenticated users can create sponsorships."
  ON sponsorships FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Only the system (or admins) can update sponsorship status
CREATE POLICY "System can update sponsorships."
  ON sponsorships FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for issue_funding
-- Everyone can view funding information
CREATE POLICY "Issue funding is viewable by everyone."
  ON issue_funding FOR SELECT
  USING (true);

-- Only authenticated users can create funding goals
CREATE POLICY "Authenticated users can create funding goals."
  ON issue_funding FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admins and issue reporters can update funding goals
CREATE POLICY "Admins and reporters can update funding goals."
  ON issue_funding FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'council')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.issues 
      WHERE id = issue_funding.issue_id AND reporter_id = auth.uid()
    )
  );

-- Function to update issue funding when sponsorship is completed
CREATE OR REPLACE FUNCTION public.update_issue_funding()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if payment is completed
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    -- Insert or update issue_funding
    INSERT INTO public.issue_funding (issue_id, current_amount, sponsor_count)
    VALUES (NEW.issue_id, NEW.amount, 1)
    ON CONFLICT (issue_id) 
    DO UPDATE SET 
      current_amount = issue_funding.current_amount + NEW.amount,
      sponsor_count = issue_funding.sponsor_count + 1,
      updated_at = timezone('utc'::text, now());
  END IF;
  
  -- Handle refunds
  IF NEW.payment_status = 'refunded' AND OLD.payment_status = 'completed' THEN
    UPDATE public.issue_funding
    SET 
      current_amount = GREATEST(0, current_amount - NEW.amount),
      sponsor_count = GREATEST(0, sponsor_count - 1),
      updated_at = timezone('utc'::text, now())
    WHERE issue_id = NEW.issue_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update funding when sponsorship status changes
CREATE TRIGGER on_sponsorship_status_change
  AFTER INSERT OR UPDATE ON public.sponsorships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_issue_funding();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_sponsorships_updated_at
  BEFORE UPDATE ON public.sponsorships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_issue_funding_updated_at
  BEFORE UPDATE ON public.issue_funding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
